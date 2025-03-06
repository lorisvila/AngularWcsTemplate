import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {API_RequestType, API_ResponseType} from "../app.types";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  // API Endpoint
  API_Url: URL =  new URL(window.location.protocol + '//' + window.location.hostname + ':3000/');
  API_Version: string = '/v1'

  // API Token
  API_token: string | undefined = undefined

  // Name of localStorage variables
  appLocalStorageVarName: string = "app";
  defaultEnginLocalStorageVarName: string = "defaultEngin";

  // Main Sections of API
  API_Section_Data: string = this.API_Version + "/data";
  API_Section_Auth: string = this.API_Version + "/auth";
  API_Section_DataManage: string = this.API_Version + "/dataManage";
  API_Section_PumaInterface: string = this.API_Version + "/pumaInterface";
  API_Section_BucketInterface: string = this.API_Version + "/bucketInterface";

  API_Endpoints = {
    auth: {
      connect: new URL(this.API_Section_Auth + "/connect", this.API_Url),
      checkToken: new URL(this.API_Section_Auth + "/checkToken", this.API_Url),

      listUsers: new URL(this.API_Section_Auth + "/listUsers", this.API_Url),
      listRoles: new URL(this.API_Section_Auth + "/listRoles", this.API_Url),
      listPostes: new URL(this.API_Section_Auth + "/listPostes", this.API_Url),

      editUser: new URL(this.API_Section_Auth + "/editUser", this.API_Url),
      createUser: new URL(this.API_Section_Auth + "/createUser", this.API_Url),
      deleteUser: new URL(this.API_Section_Auth + "/deleteUser", this.API_Url)
    },
    data: {
      refresh: new URL(this.API_Section_Data + "/refresh", this.API_Url),
      getAllTables: new URL(this.API_Section_Data + "/getAllTables", this.API_Url)
    },
    dataManage: {
      createDocument: new URL(this.API_Section_DataManage + "/createDocument", this.API_Url),
      editDocument: new URL(this.API_Section_DataManage + "/editDocument", this.API_Url),
      deleteDocument: new URL(this.API_Section_DataManage + "/deleteDocument", this.API_Url),

      createFilter: new URL(this.API_Section_DataManage + "/createFilter", this.API_Url),
      editFilter: new URL(this.API_Section_DataManage + "/editFilter", this.API_Url),
      deleteFilter: new URL(this.API_Section_DataManage + "/deleteFilter", this.API_Url)
    },
    PumaInterface: {
      uploadFile: new URL(this.API_Section_PumaInterface + "/uploadFile", this.API_Url),
      updateProgress: new URL(this.API_Section_PumaInterface + "/updateProgress", this.API_Url),

      getPLTfromEnginNumMR: new URL(this.API_Section_PumaInterface + "/getPLTfromEnginNumMR", this.API_Url),
      getOMfromEngin: new URL(this.API_Section_PumaInterface + "/getOMfromEngin", this.API_Url)
    },
    bucketInterface: {
      getUrlForUpload: new URL(this.API_Section_BucketInterface + "/getUrlForUpload", this.API_Url)
    }
  }

  constructor(
    private http: HttpClient,
    public notif: ToastrService,
  ) {
  }

  followRealTimeUpdate(URL: URL, successMessage?: string): EventEmitter<Object> {
    this.API_token ? URL.searchParams.set('token', this.API_token) : undefined // Add the API token as a query param beacuse EventSource cannot define custom headers
    const eventSource = new EventSource(URL.href);
    let updates$: EventEmitter<Object> = new EventEmitter<Object>();
    let lastMessage: Object | undefined

    eventSource.onopen = () => {
      console.log('SSE connection established');
    };

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data); // Assuming the server sends JSON
      lastMessage = message
      console.log('Last message', lastMessage)
      updates$.emit(message)
    };

    eventSource.addEventListener("end", () => {
      console.log("End message", lastMessage)
      this.handleResponse(lastMessage, successMessage)
      eventSource.close(); // Close the connection
    });

    eventSource.onerror = (error) => {
      console.error("Error during SSE:", error);
      this.handleErrorResponse(error)
      eventSource.close(); // Ensure the connection is closed
    };

    return updates$
  }

  // Main function to retrieve data from localStorage
  getDataFromStorage(key: string): undefined | any {
    let resultsString = localStorage.getItem(key)
    if (resultsString !== null) { // If the key exists in the localStorage
      try {
        return JSON.parse(resultsString);
      } catch {
        this.notif.error("Erreur dans la lecture de JSON")
        return undefined
      }
    } else {
      return undefined;
    }
  }

  // Main function to store data to localStrorage
  updateDataToStorage(key: string, value: any) {
    let stringifiedValue = JSON.stringify(value)
    localStorage.setItem(key, stringifiedValue)
  }

  // Main function to store data to localStrorage
  deleteDataFromStorage(key: string) {
    localStorage.removeItem(key)
  }

  sendFileToAPI(method: "POST" | "PUT", endpoint: URL, formData: any) {
    let headers: {} = {}
    if (this.API_token) {
      headers = {token: this.API_token}
    }
    return this.http.request(method, endpoint.href, {headers: headers, body: formData})
  }

  requestToAPI(method: "GET" | "POST" | "PUT" | "DELETE", endpoint: URL, data?: any) {
    let requestObjectBody = new API_RequestType()
    let headers: {} = {}
    if (this.API_token) {
      requestObjectBody.token = this.API_token
      headers = {token: this.API_token}
    }
    if (data) {
      requestObjectBody.data = data
    }
    return this.http.request(method, endpoint.href, {responseType: 'json', body: requestObjectBody, headers: headers})
  }

  handleResponse(response: any, successMessage?: string): API_ResponseType | undefined {
    let responseObject = (response as API_ResponseType)
    if (responseObject.status.code === 200) {
      successMessage ? this.notif.success(successMessage) : undefined
      return responseObject
    } else {
      this.notif.error(responseObject.status.message)
      return undefined
    }
  }
  handleErrorResponse(error: any, showErrorToast: boolean = true): API_ResponseType | undefined {
    error = error as HttpErrorResponse
    if (error.statusText == 'Unknown Error') {
      this.notif.error("Impossible de joindre l'API")
      return undefined
    }
    let responseObject = (error.error as API_ResponseType)
    if (showErrorToast) {
      this.notif.error(responseObject.status.message)
    }
    return responseObject
  }

}
