import {App} from "~/server";
import {Logger} from "pino";
import {authenticate, LdapAuthenticationError} from "ldap-authentication";
import {API_Error} from "~/types/errors"
import * as console from "node:console";
import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {VerifyErrors} from "jsonwebtoken";
import {UserRole, UserType} from "~/types/types";

export class AuthModule {

  App: App
  logger: Logger
  MAIN_TOKEN: string

  constructor(mainClass: App) {
    this.App = mainClass
    this.logger = this.App.AppLogger.createChildLogger(this.constructor.name)
    this.MAIN_TOKEN = this.App.config.auth.mainToken

  }

  /*OFFLINE METHODS*/

  async authentificateUserOffline(username: string, password: string): Promise<UserType> {
    return {
      "dn": "CN=Loris VILA,CN=Users,DC=ad,DC=vilaloris,DC=fr",
      "cn": "Loris VILA",
      "sn": "VILA",
      "givenName": "Loris",
      "whenCreated": "20250116193329.0Z",
      "displayName": "Loris VILA",
      "memberOf": [
        "CN=Utilisateur Habilité,OU=Portofolio,OU=Services,DC=ad,DC=vilaloris,DC=fr",
        "CN=Editeur,OU=Videos,OU=Services,DC=ad,DC=vilaloris,DC=fr",
        "CN=Lecteur,OU=Videos,OU=Services,DC=ad,DC=vilaloris,DC=fr",
        "CN=PC_Loris,OU=Loris,OU=Maison,DC=ad,DC=vilaloris,DC=fr",
        "CN=AdminRéseau,OU=Administration,DC=ad,DC=vilaloris,DC=fr",
        "CN=Family,CN=Users,DC=ad,DC=vilaloris,DC=fr",
        "CN=Utilisateurs du Bureau à distance,CN=Builtin,DC=ad,DC=vilaloris,DC=fr"
      ],
      "name": "Loris VILA",
      "objectGUID": "]\u001cOQ6gnH��\u0012�I>�2",
      "badPwdCount": "0",
      "sAMAccountName": "loris.vila",
      "userPrincipalName": "loris.vila@ad.vilaloris.fr"
    }
  }

  async extractUserOffline(username: string): Promise<UserType> {
    return {
      "dn": "CN=Loris VILA,CN=Users,DC=ad,DC=vilaloris,DC=fr",
      "cn": "Loris VILA",
      "sn": "VILA",
      "givenName": "Loris",
      "whenCreated": "20250116193329.0Z",
      "displayName": "Loris VILA",
      "memberOf": [
        "CN=Utilisateur Habilité,OU=Portofolio,OU=Services,DC=ad,DC=vilaloris,DC=fr",
        "CN=Editeur,OU=Videos,OU=Services,DC=ad,DC=vilaloris,DC=fr",
        "CN=Lecteur,OU=Videos,OU=Services,DC=ad,DC=vilaloris,DC=fr",
        "CN=PC_Loris,OU=Loris,OU=Maison,DC=ad,DC=vilaloris,DC=fr",
        "CN=AdminRéseau,OU=Administration,DC=ad,DC=vilaloris,DC=fr",
        "CN=Family,CN=Users,DC=ad,DC=vilaloris,DC=fr",
        "CN=Utilisateurs du Bureau à distance,CN=Builtin,DC=ad,DC=vilaloris,DC=fr"
      ],
      "name": "Loris VILA",
      "objectGUID": "]\u001cOQ6gnH��\u0012�I>�2",
      "badPwdCount": "0",
      "sAMAccountName": "loris.vila",
      "userPrincipalName": "loris.vila@ad.vilaloris.fr"
    }
  }

  /*END OFFLINE METHODS*/

  async authentificateUser(username: string, password: string): Promise<UserType> {
    let options = {
      ldapOpts: {
        url: this.App.config.ldap.url,
      },
      adminDn: this.App.config.ldap.adminDn,
      adminPassword: this.App.config.ldap.adminPassword,

      userSearchBase: this.App.config.ldap.userSearchBase, // Where to search the users
      usernameAttribute: this.App.config.ldap.usernameAttribute, // What field to match the requested username
      userPassword: password,
      username: username,
      attributes: this.App.config.ldap.attributes // What attributes to extract from LDAP
    }

    try {
      let user = await authenticate(options) as UserType
      if (typeof user.memberOf == 'string') {
        // If the user has only one group appartenance, the LDAP will return a string and not a string Array....
        user.memberOf = [user.memberOf]
      }
      return user
    } catch (e) {
      if (e instanceof LdapAuthenticationError) {
        throw new API_Error('BAD_CREDENTIALS', 'Les identifiants fournis sont incorrects... 😰', {code: 401})
      } else {
        this.logger.error(e)
        throw e
      }
    }

  }

  async extractUser(username: string): Promise<UserType> {
    let options = {
      ldapOpts: {url: this.App.config.ldap.url},
      adminDn: this.App.config.ldap.adminDn,
      adminPassword: this.App.config.ldap.adminPassword,

      verifyUserExists: true,
      userSearchBase: this.App.config.ldap.userSearchBase,
      usernameAttribute: this.App.config.ldap.usernameAttribute,
      username: username,
      attributes: this.App.config.ldap.attributes
    }

    try {
      let user = await authenticate(options)
      if (typeof user.memberOf == 'string') {
        user.memberOf = [user.memberOf]
      }
      return user
    } catch (e) {
      if (e instanceof LdapAuthenticationError) {
        throw new API_Error('API_INTERN_ERROR', "Une erreur est survenue lors de la vérification des rôles de l'utilisateur...")
      } else {
        this.logger.error(e)
        throw e
      }
    }
  }

  extractGroupsFromUser(user: UserType): UserRole[] {
    if (user.memberOf) {
      return user.memberOf.filter(x => x.endsWith(this.App.config.portofolio.UO_Dn)).map(x => x.split(',')[0].split('CN=')[1]) as UserRole[]
    } else {
      throw new API_Error('API_INTERN_ERROR', "Erreur lors de la récupération des groupes utilisateurs depuis l'objet utilisateur...")
    }
  }

  createUserToken(userObject: UserType): string {
    let data: UserType = {
      dn: userObject.dn,
      name: userObject.name,
      sAMAccountName: userObject.sAMAccountName,
      userPrincipalName: userObject.userPrincipalName
    }
    let userToken = jwt.sign({user: data}, this.MAIN_TOKEN, {expiresIn: "2h"})
    this.logger.debug(`Creating a token for ${data.sAMAccountName}, expires in 2h`)
    return userToken
  }

  checkUserTokenFromGET(req: Request, res: Response) {
    try {
      let token = ""
      if (req.headers.token) {token = (req.headers.token as string)}
      if (req.query.token) {token = (req.query.token as string)}
      if (!token) {
        throw new API_Error('REQUEST_VALUES_MISSING', 'Il manque le token dans votre requête...', {code: 401})
      }
      let user = (jwt.verify(token, this.MAIN_TOKEN) as any).user as UserType
      return user

    } catch (err) {
      if ((err as VerifyErrors)?.name == "TokenExpiredError") {
        this.logger.warn('User tried to log in with an expired token')
        throw new API_Error('EXPIRED_TOKEN', "Ton token a expiré", {code: 401})
      } else if (err instanceof API_Error) {
        this.logger.warn(err.name + ' ' + err.message)
        throw err
      } else {
        this.logger.debug('User tried to log in with an invalid token')
        throw new API_Error('INVALID_TOKEN', "Ton token est invalide", {code: 401})
      }
    }
  }

}
