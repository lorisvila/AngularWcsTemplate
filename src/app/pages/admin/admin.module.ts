import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './pages/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "@ngx-formly/core";
import {WcsAngularModule} from "wcs-angular";
import { TableauBordComponent } from './pages/tableau-bord/tableau-bord.component';
import {SharedContentModule} from "../../modules/shared-content/shared-content.module";
import {UsersListComponent} from "./pages/users/users-list/users-list.component";
import { CreateModUserComponent } from './pages/users/create-mod-user/create-mod-user.component';
import { ChangePasswordComponent } from './pages/users/change-password/change-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    TableauBordComponent,

    //User pages
    UsersListComponent,
    CreateModUserComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormlyModule,
    WcsAngularModule,
    SharedContentModule,
  ]
})
export class AdminModule { }
