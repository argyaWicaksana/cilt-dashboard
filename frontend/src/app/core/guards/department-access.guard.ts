
import { AuthenticationService } from "../services/auth.service";
import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from "../models/auth.models";
@Injectable({
  providedIn: 'root',
})
export class DepartmentAccessGuard implements CanActivate {
  constructor(
    private authService:AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user: User = this.authService.currentUser!
    const user_level = parseInt(user.user_level_report);

    const paramID = route.params['id']
    const paramDetail = route.params['detail']
    const itemProjectRole = 66
    const progressImprovementRole = 55
    const morningMeetingRole = 56
    
    const preparationRoles = [1,2,3]
    const injectionRoles = [1,2,4]
    const blowfillRoles = [1,2,5]
    const packingRoles = [1,2,6]
    const packerRoles = [1,2,7]
    const weighingRoles = [1,2,8]
    const preparationRolesOC2 = [1,2,3]
    const injectionRolesOC2 = [1,2,9]
    const blowfillRolesOC2 = [1,2,10]
    const packingRolesOC2 = [1,2,11]
    const packerRolesOC2 = [1,2,7]
    const weighingRolesOC2 = [1,2,8]
    const securityRoles = [2]
    function checkBaseDepartment(authService:any) {
      if (paramID!.toLowerCase() == 'oc1') {
        switch (paramDetail!.toLowerCase()) {
          case 'preparation':
            if (authService.userHasRoleReport(preparationRoles)) {
              return true;
            }
            return false
          case 'injection':
            if (authService.userHasRoleReport(injectionRoles)) {
              return true;
            }
            return false
          case 'blowfill':
            if (authService.userHasRoleReport(blowfillRoles)) {
              return true;
            }
            return false
          case 'packing':
            if (authService.userHasRoleReport(packingRoles)) {
              return true;
            }
            return false
          case 'packer':
            if (authService.userHasRoleReport(packerRoles)) {
              return true;
          }
            return false
          default:
            return false
        }
      } else if (paramID!.toLowerCase() == 'oc2') {
        switch (paramDetail!.toLowerCase()) {
          case 'preparation':
            if (authService.userHasRoleReport(preparationRolesOC2)) {
              return true;
            }
            return false
          case 'injection':
            if (authService.userHasRoleReport(injectionRolesOC2)) {
              return true;
            }
            return false
          case 'blowfill':
            if (authService.userHasRoleReport(blowfillRolesOC2)) {
              return true;
            }
            return false
          case 'packing':
            if (authService.userHasRoleReport(packingRolesOC2)) {
              return true;
            }
            return false
          case 'packer':
            if (authService.userHasRoleReport(packerRolesOC2)) {
              return true;
            }
            return false
          case 'weighing':
            if (authService.userHasRoleReport(weighingRolesOC2)) {
              return true;
            }
            return false
          default:
            return false
        }
      } else if (paramID!.toLowerCase() == 'security') {
        if (authService.userHasRoleReport(securityRoles)) {
          return true;
        }
        return false
      }
      return false
    }
    const result = checkBaseDepartment(this.authService)
    if (!result) {
      if (this.authService.userHasRoleReport([itemProjectRole])) {
        this.router.navigate(["/ereport/item-projects"]);
        return true;
      }
      if (this.authService.userHasRoleReport([progressImprovementRole])) {
        this.router.navigate(["/ereport/progress_improvement"]);
        return true;
      }
      if (this.authService.userHasRoleReport([morningMeetingRole])) {
        this.router.navigate(["/ereport/morning-meeting"]);
        return true
      }
    }
    return result;
  }
  
}
