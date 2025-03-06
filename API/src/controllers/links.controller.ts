import {App} from "~/server";
import {Logger} from "pino";
import {Router} from "express";
import {RequestType} from "~/types/types";

export class LinksController {

    App: App
    logger: Logger
    router: Router
    mainEndpoint: string = "/links"

    constructor(mainClass: App) {
        this.router = Router()
        this.App = mainClass
        this.logger = this.App.AppLogger.createChildLogger(this.constructor.name);

        this.router.get('/getLinks', async (req, res) => {
            let reqObject: RequestType = req.body as RequestType
            try {
                let links = await this.App.DbModule.dbTableQuery('portofolio.links', {column: 'internalUrl', order: "ASC"})
                this.App.sendResponse(res, {links: links}, {token: reqObject.token})
            } catch (error) {
                this.App.handleError(res, error)
            }
        })

    }

}
