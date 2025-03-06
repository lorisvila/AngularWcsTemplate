import { NgModule } from '@angular/core';
import {AppRoutingModule} from "./app-routing.module";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { WcsAngularModule } from "wcs-angular";
import { CookieService } from "ngx-cookie-service";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WcsFormlyModule } from "wcs-formly";
import { FormlyModule } from "@ngx-formly/core";
import { ReactiveFormsModule } from "@angular/forms";
import {AppComponent} from "./app.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {SidemenuComponent} from "./components/sidemenu/sidemenu.component";
import { SharedContentModule } from './modules/shared-content/shared-content.module';
import {RouterLink, RouterLinkActive} from "@angular/router";

// Only import standalone components/modules here (not necessary to re-declare them)
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NavbarComponent,
    SidemenuComponent,
  ],
  imports: [
    SharedContentModule, // Shared content

    WcsAngularModule, // WCS & components modules
    WcsFormlyModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    BrowserModule, // Request modules
    HttpClientModule,

    AppRoutingModule, // Routing modules
    RouterLink,
    RouterLinkActive,

    FormlyModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      maxOpened: 4,
    }),
  ],
  providers: [
    CookieService
  ]
})
export class AppModule { }
