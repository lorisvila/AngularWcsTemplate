import {AfterViewInit, Component} from '@angular/core';
import {FormSubmittedEvent, UntypedFormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {CommunicationService} from "../../../../services/communication.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {DataService} from "../../../../services/data.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false
})
export class LoginComponent implements AfterViewInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
  ) {
    if (this.authService.userObject) {
      this.router.navigate(this.dataService.appRoutes.Admin.TableauDeBord)
    }

    this.form.events.subscribe((event) => {
      if (event instanceof FormSubmittedEvent) {
        this.authService.authentificateUser(this.model)
      }
    })
  }

  form: UntypedFormGroup = new UntypedFormGroup({})
  model: any = {}
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: "columnForm",
      fieldGroup: [
        {
          type: "input",
          id: "username",
          key: "username",
          className: 'username-login-field',
          props: {
            label: "Utilisateur",
            type: "text",
            required: true
          }
        },
        {
          type: "input",
          id: "password",
          key: "password",
          className: 'password-login-field',
          props: {
            label: "Mot de passe",
            type: "password",
            required: true
          }
        }
      ]
    }
  ]

  ngAfterViewInit(): void {
    document.getElementsByClassName('username-login-field')[0].addEventListener('keyup', (e: any) => {
      if ((e as KeyboardEvent).key == 'Enter') {
        this.authService.authentificateUser(this.model)
      }
    })
    document.getElementsByClassName('password-login-field')[0].addEventListener('keyup', (e: any) => {
      if ((e as KeyboardEvent).key == 'Enter') {
        this.authService.authentificateUser(this.model)
      }
    })
  }

}
