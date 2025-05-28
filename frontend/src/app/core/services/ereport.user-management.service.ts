import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { GlobalComponent } from "../../global-component";
import { environment } from "src/environments/environment";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
};

@Injectable({
  providedIn: "root",
})
export class EreportUsersManagementervice {
  readonly BASE_URL = environment.baseUrl + "/e-report/user-management";

  constructor(private http: HttpClient) {}

  getUsers(params?: any) {
    return this.http.get(this.BASE_URL + `/`, {
      params,
    });
  }
  getUsersById(id: string) {
    return this.http.get(this.BASE_URL + `/item/${id}`);
  }
  getImageUrl(image: string) {
    return `${environment.baseUrlRaw}/e-report${image}`;
  }

  getUsersPIC() {
    return this.http.get(this.BASE_URL + `/pic`);
  }

  postUsers(data: any) {
    return this.http.post(this.BASE_URL + `/create`, data);
  }

  updateUsers({ id, data }: { id: string; data: any }) {
    return this.http.put(this.BASE_URL + `/edit/${id}`, data);
  }
  deleteUsersData(id: string) {
    return this.http.delete(this.BASE_URL + `/delete/${id}`);
  }

  getLines() {
    return this.http.get(this.BASE_URL + `/lines`);
  }
  getMorningMeetingItems(params?: any) {
    return this.http.get(this.BASE_URL + `/all-items`, {
      params,
    })
  }

}
