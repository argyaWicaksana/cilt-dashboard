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
export class EreportMorningMeetingService {
  readonly BASE_URL = environment.baseUrl + "/e-report/morning-meeting";

  constructor(private http: HttpClient) {}

  getMorningMeetings(params?: any) {
    return this.http.get(this.BASE_URL + `/`, {
      params,
    });
  }
  getMorningMeetingsById(id: string) {
    return this.http.get(this.BASE_URL + `/item/${id}`);
  }
  getImageUrl(image: string) {
    return `${environment.baseUrlRaw}/e-report${image}`;
  }

  getMorningMeetingsPIC() {
    return this.http.get(this.BASE_URL + `/pic`);
  }

  postMorningMeetings(data: any) {
    return this.http.post(this.BASE_URL + `/create`, data);
  }

  updateMorningMeetings({ id, data }: { id: string; data: any }) {
    return this.http.put(this.BASE_URL + `/edit/${id}`, data);
  }
  deleteMorningMeetingsData(id: string) {
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
