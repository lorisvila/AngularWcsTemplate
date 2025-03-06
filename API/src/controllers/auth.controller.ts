import {Router} from "express";
import {App} from "~/server";
import {RequestType, UserType} from "~/types/types";
import {API_Error} from "~/types/errors";

export class AuthController {

  App: App
  router: Router
  mainEndpoint: string = "/auth"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    this.router.post('/connect', (req, res) => {
      let dataSchema = {
        data: {
          username: 'string',
          password: 'string'
        }
      }

      let reqObject: RequestType = req.body as RequestType
      if (!reqObject || !reqObject.data?.username || !reqObject.data?.password) {
        this.App.handleError(res, new API_Error('REQUEST_VALUES_MISSING', 'Il manque des paramètres dans votre requête', {code: 400, schema: dataSchema}))
        return;
      }
      this.App.LdapModule.authentificateUser(reqObject.data.username, reqObject.data.password)
      /*this.App.LdapModule.authentificateUserOffline(reqObject.data.username, reqObject.data.password)*/
      .then((user: UserType) => {
        let token = this.App.LdapModule.createUserToken(user)
        let groups = this.App.LdapModule.extractGroupsFromUser(user)
        this.App.sendResponse(res, {token: token, user: user, groups: groups}, {token: token})
      })
      .catch((error) => {
        this.App.handleError(res, error)
      })
    })

    this.router.get('/checkToken', async (req, res) => {
      let reqObject: RequestType = req.body as RequestType
      try {
        let tokenUser = this.App.LdapModule.checkUserTokenFromGET(req, res)
        let user = await this.App.LdapModule.extractUser(tokenUser.sAMAccountName)
        /*let user = await this.App.LdapModule.extractUserOffline(tokenUser.sAMAccountName)*/
        let groups = await this.App.LdapModule.extractGroupsFromUser(user)
        this.App.sendResponse(res, {user: user, groups: groups}, {token: reqObject.token})
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

  }

}
