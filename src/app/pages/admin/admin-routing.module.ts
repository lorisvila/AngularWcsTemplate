import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {TableauBordComponent} from "./pages/tableau-bord/tableau-bord.component";
import {AdminGuard} from "./guards/admin.guard";
import {UsersListComponent} from "./pages/users/users-list/users-list.component";
import {CreateModUserComponent} from "./pages/users/create-mod-user/create-mod-user.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },
  {
    path: 'Login',
    component: LoginComponent
  },
  {
    path: 'TableauDeBord',
    component: TableauBordComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'Utilisateur',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'Liste'
      },
      {
        path: 'Liste',
        component: UsersListComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'Ajouter',
        component: CreateModUserComponent,
        canActivate: [AdminGuard],
        data: {formState: "add"}
      },
      {
        path: 'Editer',
        component: CreateModUserComponent,
        canActivate: [AdminGuard],
        data: {formState: "edit"}
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
