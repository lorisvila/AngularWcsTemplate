import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";
import {StillInDevPageComponent} from "./pages/still-in-dev-page/still-in-dev-page.component";
import {WcsAngularModule} from "wcs-angular";
import {FlatCardComponent} from "./components/flat-card/flat-card.component";
import {HeaderComponent} from "./components/header/header.component";


@NgModule({
  declarations: [
    // Pages
    NotFoundPageComponent,
    StillInDevPageComponent,

    // Components
    FlatCardComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    WcsAngularModule
  ],
  exports: [
    // Pages
    NotFoundPageComponent,
    StillInDevPageComponent,

    // Components
    FlatCardComponent,
    HeaderComponent,
  ]
})
export class SharedContentModule { }
