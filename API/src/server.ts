import express, {Express, NextFunction, Request, Response, Router} from 'express';
import {ConfigType, ResponseType} from "~/types/types";
import {DataController} from "~/ressources/data.controller"
import {AuthController} from '~/ressources/auth.controller'
import {DataManagerController} from "~/ressources/dataManager.controller";
import {AuthModule} from "~/modules/auth.module";
import {DataModule} from "~/modules/data.module";
import {API_Error} from "~/types/errors";
import * as console from "node:console";
import cookieParser from "cookie-parser";
import {Logger} from "pino";
import cors from 'cors';
import fs from 'fs';
import {AppLogger} from "~/appLogger";
import {BucketInterfaceController} from "~/ressources/bucketInterface.controller";
import {BucketInterfaceModule} from "~/modules/bucketInteface.module";


const CONFIG_FILE_PATH: string = "./config.json"


export class App {

  app: Express = express()
  mainRouter: Router = Router();
  config: ConfigType

  AuthController: AuthController
  DataController: DataController
  DataManagerController: DataManagerController
  BucketInterfaceController: BucketInterfaceController
  BucketInterfaceModule: BucketInterfaceModule

  AuthModule: AuthModule
  DataModule: DataModule

  AppLogger: AppLogger
  logger: Logger

  constructor() {
    let tmp_config: ConfigType | undefined = this.getConfig()
    if (!tmp_config) { // If config not found
      console.error("No config found, quitting the app")
      process.exit(2)
    }
    this.config = tmp_config
    this.AppLogger = new AppLogger(this.config)
    this.logger = this.AppLogger.getLogger()

    this.logger.debug('Starting all controllers')
    this.AuthController = new AuthController(this)
    this.DataController = new DataController(this)
    this.DataManagerController = new DataManagerController(this)
    this.BucketInterfaceController = new BucketInterfaceController(this)

    this.logger.debug('Starting all modules')
    this.AuthModule = new AuthModule(this)
    this.DataModule = new DataModule(this)
    this.BucketInterfaceModule = new BucketInterfaceModule(this)

    this.logger.debug('Configurating the express module')
    this.app.use(cors({origin: '*'}))
    this.app.use(express.json())
    this.app.use(cookieParser())

    this.app.use(this.logRequest(this))

    this.app.use('/v1', this.mainRouter)

    this.mainRouter.use(this.DataController.mainEndpoint, this.DataController.router)
    this.mainRouter.use(this.AuthController.mainEndpoint, this.AuthController.router)
    this.mainRouter.use(this.DataManagerController.mainEndpoint, this.DataManagerController.router)
    this.mainRouter.use(this.BucketInterfaceController.mainEndpoint, this.BucketInterfaceController.router)

    this.app.use((req, res, next) => {
      let endpoint = req.url
      this.sendResponse(res, {}, {code: 404, message: `Endpoint '${endpoint}' not found...`})
    })

    this.logger.info(`Serving server on ${this.config.webserver.host}:${this.config.webserver.port}`)
    this.app.listen(this.config.webserver.port, this.config.webserver.host)
  }

  logRequest = (mainClass: App) => {
    return (req: Request, res: Response, next: NextFunction) => {
      let ip = req.ip
      let endpoint = req.url
      let date = new Date().toUTCString()
      mainClass.logger.debug(`${date} | ${ip} | ${endpoint}`)
      next()
    }
  }

  createResponseObject(data: any, params?: {code?: number, message?: string, token?: string}): ResponseType {
    return {
      date: new Date().getTime(),
      data: data,
      token: undefined,
      status: {
        code: params?.code ? params.code : 200,
        message: params?.message ? params.message : undefined,
      }
    }
  }

  sendResponse(res: Response, data: any, params?: {code?: number, message?: string, token?: string}) {
    let responseObject: ResponseType = this.createResponseObject(data, {code: params?.code, message: params?.message, token: params?.token})
    if (params?.token) {
      responseObject.token = params.token
      res.cookie(this.config.auth.cookieName, params.token)
    }
    res.status(responseObject.status.code)
    res.json(responseObject)
  }

  handleError(res: Response, error: unknown) {
    if (error instanceof API_Error) {
      this.sendResponse(res, error.cause, {code: error.code, message: error.message})
    } else {
      throw error
    }
  }

  getConfig(): ConfigType | undefined {
    let config = undefined
    try {
      config = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
    } catch {
      console.error('Error while trying to read the config file')
      return undefined
    }
    try {
      let configJSON = JSON.parse(config)
      return configJSON as ConfigType
    } catch (e) {
      console.error('Error while trying to interpret the config file')
      return undefined
    }
  }

  writeConfig() {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(this.config, null, 4))
  }

}

new App() // Launch the app
