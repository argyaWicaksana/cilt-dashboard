import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class EntryPointAccessGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user_level = parseInt(this.authService.currentUser!.user_level_report);
    
    // item-projects
    if (user_level >= 1 && user_level <= 11) {
      this.router.navigate(["/ereport"]);
    }
    if (user_level == 66) {
      this.router.navigate(["/ereport/item-projects"]);
    }
    return false;
  }
}
