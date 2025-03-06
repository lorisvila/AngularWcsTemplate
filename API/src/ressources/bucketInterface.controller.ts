import {Router} from "express";
import { App } from "~/server";

export class BucketInterfaceController {

  App: App
  router: Router
  mainEndpoint: string = "/bucketInterface"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    this.router.get("/getUrlForUpload/:fileName(*)", (req, res) => {
      try {
        let fileName = req.params.fileName;

        let user = this.App.AuthModule.checkUserTokenFromGET(req, res)
        this.App.AuthModule.checkRole(['AjouterFichierStockage'], user)

        this.App.BucketInterfaceModule.generatePresignedUrl(fileName).then((URL) => {
          this.App.sendResponse(res, URL)
        }).catch(error => {
          this.App.sendResponse(res, undefined, {code: 500, message: error.message})
        });
      } catch (e) {
        this.App.handleError(res, e)
      }
    })

  }
}
