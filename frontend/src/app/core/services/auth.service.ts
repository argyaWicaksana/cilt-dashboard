import { Injectable } from "@angular/core";
import { getFirebaseBackend } from "../../authUtils";
import { User } from "../models/auth.models";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import * as crypto from "crypto-js";
import { environment } from "src/environments/environment";
import { Response } from "../models/response.models";

@Injectable({ providedIn: "root" })

/**
 * Auth-service Component
 */
export class AuthenticationService {
  private _userToken: string = "";
  private _currentUser?: User;
  readonly baseApi = environment.baseApi2;

  constructor(private http: HttpClient, private router: Router) {
  }

  setUser(userData: User & { token: string }) {
    this._userToken = userData.token;
    localStorage.setItem("user-token", this._userToken);

    this._currentUser = userData;
    localStorage.setItem('current-user', JSON.stringify(this._currentUser));

    // if (this.userToken) {
    //   const rawToken = atob(this.userToken)
    //   const userJSON = crypto.AES.decrypt(
    //     rawToken,
    //     environment.secret
    //   ).toString(crypto.enc.Utf8);
    //   this._currentUser = JSON.parse(userJSON);
    //   localStorage.setItem('current-user', userJSON)
    //   return
    // }
    // if (userLocal) {
    //   this._currentUser = JSON.parse(userLocal);
    //   return
    // }
  }

  userHasRole(roles: number[]): boolean {
    this._currentUser = JSON.parse(localStorage.getItem('current-user') ?? '');
    return (this._currentUser ?? false) && roles.includes(this._currentUser!.user_level);
  }

  userHasRoleReport(roles: number[]): boolean {
    if (!this._currentUser) {
      return false
    }
    const splitted = this._currentUser!.user_level_report.split(",");
    const result = splitted.map((x) => parseInt(x));
    return roles.some(r => result.includes(r))
  }

  get currentUser(): User | undefined {
    this._currentUser = JSON.parse(localStorage.getItem('current-user') ?? '');
    return this._currentUser;
  }

  get userLocal(): User | undefined {
    const userLocal = localStorage.getItem("current-user");
    if (userLocal) {
      this._currentUser = JSON.parse(userLocal);
      return this._currentUser;
    }
    return undefined;
  }

  login(data: any) {
    return firstValueFrom(this.http.post<Response>(`${this.baseApi}/api/auth/login`, data));
  }

  logout() {
    this._currentUser = undefined;
    this._userToken = "";
    localStorage.removeItem("current-user");
    localStorage.removeItem("user-token");
    this.router.navigate(['/auth/login']);
  }
}
