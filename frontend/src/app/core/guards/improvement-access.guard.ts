import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class ImprovementAccessGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const splitted = this.authService.currentUser?.user_level_report.split(",");
    const result = splitted?.map((x) => parseInt(x));
    console.log("result ", result);
    const allowedUser = [1,2,55,66]
    const found = allowedUser.some(r=> result?.includes(r))
    console.log("found ", found);
    return found
  }
}
