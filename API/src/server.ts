import cors from 'cors';
import fs from 'fs';
import express, {Express, NextFunction, Request, Response, Router} from 'express';
import {ConfigType, ResponseType} from "~/types/types";
import {API_Error} from "~/types/errors";
import * as console from "node:console";
import cookieParser from "cookie-parser";
import {Logger} from "pino";
import {AppLogger} from "~/appLogger";
import {AuthController} from "~/controllers/auth.controller";
import {AuthModule} from "~/modules/auth.module";
import {WireguardController} from "~/controllers/wireguard.controller";
import {WireguardModule} from "~/modules/wireguard.module";
import {LinksController} from "~/controllers/links.controller";
import {DbModule} from "~/modules/db.module";


const CONFIG_FILE_PATH: string = "./config.json"


export class App {

  app: Express = express()
  mainRouter: Router = Router();
  config: ConfigType

  LdapController: AuthController
  WireguardController: WireguardController
  LinksController: LinksController

  LdapModule: AuthModule
  WireguardModule: WireguardModule
  DbModule: DbModule

  AppLogger: AppLogger
  logger: Logger

  constructor() {
    let tmp_config: ConfigType | undefined = this.getConfig()
    if (!tmp_config) {
      console.error("No config found, quitting the app")
      process.exit(2)
    }
    this.config = tmp_config
    this.AppLogger = new AppLogger(this.config)
    this.logger = this.AppLogger.getLogger()

    this.logger.debug('Starting all controllers')
    this.LdapController = new AuthController(this)
    this.WireguardController = new WireguardController(this)
    this.LinksController = new LinksController(this)

    this.logger.debug('Starting all modules')
    this.LdapModule = new AuthModule(this)
    this.WireguardModule = new WireguardModule(this)
    this.DbModule = new DbModule(this)

    this.logger.debug('Configurating the express module')
    this.app.use(cors({origin: '*'}))
    this.app.use(express.json())
    this.app.use(cookieParser())

    this.app.use(this.logRequest(this))

    this.app.use('/v1', this.mainRouter)

    this.mainRouter.get('/', (req: Request, res: Response) => {
      this.sendResponse(res, undefined, {message: 'The API is working 😀'})
    })

    this.mainRouter.use(this.LdapController.mainEndpoint, this.LdapController.router)
    this.mainRouter.use(this.WireguardController.mainEndpoint, this.WireguardController.router)
    this.mainRouter.use(this.LinksController.mainEndpoint, this.LinksController.router)

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

  createResponseObject(data: any, params?: {code?: number, message?: string, token?: string, cause?: any, schema?: any}): ResponseType {
    return {
      date: new Date().getTime(),
      data: data,
      token: undefined,
      status: {
        code: params?.code ? params.code : 200,
        message: params?.message ? params.message : undefined,
        cause: params?.cause ? params.cause : undefined,
      },
      schema: params?.schema ? params.schema : undefined,
    }
  }

  sendEventStreamMessage(res: Response, data: any) {
    let dataString = JSON.stringify(data)
    res.write(`data: ${dataString}\n\n`)
  }

  sendResponse(res: Response, data: any, params?: {code?: number, message?: string, token?: string, cause?: any, schema?: any}) {
    let responseObject: ResponseType = this.createResponseObject(data, {code: params?.code, message: params?.message, token: params?.token, cause: params?.cause, schema: params?.schema})
    if (params?.token) {
      responseObject.token = params.token
    }
    res.status(responseObject.status.code)
    res.json(responseObject)
  }

  handleError(res: Response, error: unknown) {
    if (error instanceof API_Error) {
      // @ts-ignore
      this.sendResponse(res, undefined, {code: error.code, message: error.message, cause: error.cause, schema: error.schema})
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

const server: App = new App()
