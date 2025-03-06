import {Injectable} from '@angular/core';
import {API_ResponseType, UserType} from "../app.types";
import {CommunicationService} from "./communication.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userObject: UserType | undefined
  private _$checkFinished = new BehaviorSubject<boolean>(false)
  $checkFinished: Observable<boolean> = this._$checkFinished.asObservable();

  constructor(
    private communicationService: CommunicationService,
    private notif: ToastrService,
    private router: Router,
  ) {
    this.checkToken()
  }

  // Function to check the token in localStorage
  checkToken() {
    let token = this.communicationService.getDataFromStorage('token')
    if (token) {
      let requestObject = {"token": token}
      let endpoint = this.communicationService.API_Endpoints.auth.checkToken
      this.communicationService.requestToAPI("POST", endpoint, requestObject).subscribe((response) => {
        let responseObject = (response as API_ResponseType)
        if (responseObject.status.code == 200) {
          this.userObject = responseObject.data.user
          this.communicationService.API_token = token
        } else {
          this.notif.warning(responseObject.status.message)
          this.communicationService.deleteDataFromStorage("token")
        }
        this._$checkFinished.next(true)
      }, (error) => {
        this.communicationService.handleErrorResponse(error)
        this.communicationService.deleteDataFromStorage("token")
        this._$checkFinished.next(true)
      })
    } else {
      this._$checkFinished.next(true)
    }
  }

  // Function to connect to AD DS via API & LDAP
  authentificateUser(model: {username: string, password: string}) {
    this.communicationService.requestToAPI('POST', this.communicationService.API_Endpoints.auth.connect, model)
      .subscribe((data) => {
        let response = this.communicationService.handleResponse(data, 'Connecté avec succès 😁')
        if (response) {
          this.userObject = response.data.user;
          this.communicationService.API_token = response.data.token;
          this.communicationService.updateDataToStorage("token", response.data.token);
          this.router.navigate(['Admin', 'TableauDeBord']);
        }
      }, (error) => {
        this.communicationService.handleErrorResponse(error)
      })
  }

  disconnectUser() {
    this.userObject = undefined
    this.communicationService.deleteDataFromStorage('token')
    this.router.navigate(['']);
  }

}
