import {CommunicationService} from "../../../services/communication.service";
import {BehaviorSubject, catchError, map, Observable, tap} from "rxjs";
import {PosteType, RoleType, UserType} from "../../../app.types";
import {GeneralService} from "../../../services/general.service";
import {DataService} from "../../../services/data.service";
import {ToastrService} from "ngx-toastr";
import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(
    public dataService: DataService,
    public communicationService: CommunicationService,
    public generalService: GeneralService,
    public notif: ToastrService,
    public router: Router
  ) {
    this.getUsers()
    this.getRoles()
    this.getPostes()
  }

  // ################################### Users ###################################

  private _users$ = new BehaviorSubject<UserType[]>([]);
  users$: Observable<UserType[]> = this._users$.asObservable();

  private _roles$ = new BehaviorSubject<RoleType[]>([]);
  roles$: Observable<RoleType[]> = this._roles$.asObservable();

  private _postes$ = new BehaviorSubject<PosteType[]>([]);
  postes$: Observable<PosteType[]> = this._postes$.asObservable();

  getUsers(): void {
    this.communicationService.requestToAPI("GET", this.communicationService.API_Endpoints.auth.listUsers)
      .pipe(
        map((response: any) => this.communicationService.handleResponse(response)),
        map(responseObject => responseObject && responseObject.data ? responseObject.data.users : []), // Extract users or default to empty array
        tap(users => this._users$.next(users)),  // Update the BehaviorSubject
        catchError(error => {
          this.communicationService.handleErrorResponse(error);
          return []; // or throwError(error); depending on your error handling
        })
      )
      .subscribe(); // Don't forget to subscribe to trigger the request
  }

  getRoles(): void {
    this.communicationService.requestToAPI("GET", this.communicationService.API_Endpoints.auth.listRoles) // Make sur that you have the correct Endpoint
      .pipe(
        map((response: any) => this.communicationService.handleResponse(response)),
        map(responseObject => responseObject && responseObject.data ? responseObject.data.roles : []), // Extract roles
        tap(roles => this._roles$.next(roles)),
        catchError(error => {
          this.communicationService.handleErrorResponse(error);
          return [];
        })
      )
      .subscribe();
  }

  getPostes(): void {
    this.communicationService.requestToAPI("GET", this.communicationService.API_Endpoints.auth.listPostes) // Make sur that you have the correct Endpoint
      .pipe(
        map((response: any) => this.communicationService.handleResponse(response)),
        map(responseObject => responseObject && responseObject.data ? responseObject.data.postes : []), // Extract postes
        tap(postes => this._postes$.next(postes)),
        catchError(error => {
          this.communicationService.handleErrorResponse(error);
          return [];
        })
      )
      .subscribe();
  }

  createUser(user: UserType): void {
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoints.auth.createUser, {user: user}).subscribe(
      (response) => {
        let check = this.communicationService.handleResponse(response)
        if (check) { // If request = code 200
          this.notif.success('User created successfully')
          this.getUsers()
        }
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  editUser(oldUser: UserType, newUser: UserType): void {
    this.communicationService.requestToAPI('POST', this.communicationService.API_Endpoints.auth.editUser, {oldUser: oldUser, newUser: newUser}).subscribe(
      (response) => {
        let check = this.communicationService.handleResponse(response)
        if (check) { // If request = code 200
          this.notif.success('User edited successfully')
          this.getUsers()
        }
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  deleteUser(user: UserType) {
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoints.auth.deleteUser, {user: user}).subscribe(
      (response) => {
        let check = this.communicationService.handleResponse(response)
        if (check) { // If request = code 200
          this.notif.success('User deleted successfully')
          this.getUsers()
        }
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  analyzePasswordStrength(password: string): { score: number, message: string } {
    let score = 0;
    let message = '';

    // Check length
    if (password.length >= 8) {
      score += 2;
    } else if (password.length >= 6) {
      score += 1;
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      score += 1;
    }

    // Check for numbers
    if (/[0-9]/.test(password)) {
      score += 1;
    }

    // Check for special characters
    if (/[!@+#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    }

    // Determine the strength message based on the score
    if (score >= 5) {
      message = 'Fort';
    } else if (score >= 3) {
      message = 'Moyen';
    } else {
      message = 'Faible';
    }
    score = score * 100 / 6

    return { score, message };
  }

}
