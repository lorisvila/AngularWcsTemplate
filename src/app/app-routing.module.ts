import {NotFoundPageComponent} from "./modules/shared-content/pages/not-found-page/not-found-page.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';

const routes: Routes = [
  {path: '', redirectTo: 'Accueil', pathMatch: 'full'},
  {path: 'Accueil', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)},

  // Administration et neutralino module
  {path: 'Admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)},

  {path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
