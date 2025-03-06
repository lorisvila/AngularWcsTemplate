import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {filter, firstValueFrom, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notif: ToastrService,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    // Wait until _$checkFinished emits true
    if (!(await firstValueFrom(this.authService.$checkFinished))) {
      await firstValueFrom(this.authService.$checkFinished.pipe(
        filter(value => value), // Wait until value is true
        take(1) // Take the first true value and complete
      ));
    }
    if (!this.authService.userObject) {
      this.notif.warning("La page que vous essayez de charger nécessite de s'authentifier...");
      this.router.navigate(["Admin", "Login"]);
      return false;
    }
    return true;
  }
}
