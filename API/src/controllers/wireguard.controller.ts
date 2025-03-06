import {Router} from "express";
import {App} from "~/server";
import {RequestType, UserType} from "~/types/types";
import {Logger} from "pino";

export class WireguardController {

    App: App
    logger: Logger
    router: Router
    mainEndpoint: string = "/wireguard"

    constructor(mainClass: App) {
        this.router = Router()
        this.App = mainClass
        this.logger = this.App.AppLogger.createChildLogger(this.constructor.name);

        this.router.get('/getPeers', async (req, res) => {
            let reqObject: RequestType = req.body as RequestType
            try {
                let peers = await this.App.WireguardModule.getWireguardPeers()
                /*let peers = await this.App.WireguardModule.getWireguardPeersOffline()*/
                this.App.sendResponse(res, {peers: peers}, {token: reqObject.token})
            } catch (error) {
                this.App.handleError(res, error)
            }
        })

    }

}
