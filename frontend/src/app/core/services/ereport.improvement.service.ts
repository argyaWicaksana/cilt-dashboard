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
export class EreportImprovementService {
  readonly BASE_URL = environment.baseUrl + "/e-report/improvement";

  constructor(private http: HttpClient) {}

  getImprovements(params?: any) {
    return this.http.get(this.BASE_URL + `/`, {
      params,
    });
  }
  getDetailItems(id:string) {
    return this.http.get(this.BASE_URL + `/detail/${id}`);
  }
  getImageUrl(image: string) {
    if (!image) {
      return "";
    }
    return `${environment.baseUrlRaw}/e-report/improvement/${image}`;
  }

  getImprovementsById(id: string) {
    return this.http.get(this.BASE_URL + `/${id}`);
  }

  postImprovement(data: any) {
    return this.http.post(this.BASE_URL + `/create`, data);
  }

  updateImprovement({ id, data }: { id: string; data: any }) {
    return this.http.put(this.BASE_URL + `/edit/${id}`, data);
  }
  updateNextActivity(data: any) {
    return this.http.put(this.BASE_URL + `/edit-next-activity`, { data });
  }

  deleteImprovementData(id: string) {
    return this.http.delete(this.BASE_URL + `/delete/${id}`);
  }

  getCategoryImprovement() {
    return this.http.get(this.BASE_URL + `/categories`);
  }
  getProgressPercentages() {
    return this.http.get(this.BASE_URL + `/progress-percentages`);
  }
  getLines() {
    return this.http.get(this.BASE_URL + `/lines`);
  }
  getImprovementByPercentage(params?: any) {
    return this.http.get(this.BASE_URL + `/by-percentage`, {
      params,
    });
  }
  getWOSuggestion(params?: any) {
    return this.http.get(this.BASE_URL + `/get-wo-costs`, {
      params,
    });
  }

  postProgressActivity({ id, data }: { id: string; data: any }) {
    return this.http.post(
      this.BASE_URL + `/create-activity` + `/${id}`,
      data
    );
  }
  updateProgressActivity({ id, data }: { id: string; data: any }) {
    return this.http.put(
      this.BASE_URL + `/update-progress` + `/${id}`,
      data
    );
  }
  isTimeLess(time1: string, time2: string) {
    // Split the time strings into [hours, minutes]
    let [hours1, minutes1] = time1.split(":").map(Number);
    let [hours2, minutes2] = time2.split(":").map(Number);

    // Compare hours
    if (hours1 > hours2) {
      return false;
    } else if (hours1 < hours2) {
      return true;
    } else {
      // If hours are equal, compare minutes
      if (minutes1 > minutes2) {
        return false;
      } else if (minutes1 < minutes2) {
        return true;
      } else {
        return false;
      }
    }
  }
  postActivityProject({ id, data }: { id: string; data: any }) {
    return this.http.post(
      this.BASE_URL + `/create-activity/${id}`,
      data
    );
  }
  updateProgressPercentage({ id, data }: { id: string; data: any }) {
    return this.http.put(
      this.BASE_URL + `/update-progress/${id}`,
      data
    );
  }
  updateActivity(id:any,data:any){
    return this.http.put(this.BASE_URL + `/update-activity/${id}`,data);
  }
  deleteActivity(id:number){
    return this.http.delete(this.BASE_URL + `/delete-activity/${id}`);
  }

  getOTEmployees(name:string){
    return this.http.get<any>(this.BASE_URL + `/get-ot-employees`,{
      params:{
        name
      }
    });
  }
  updateFindingDescription({id,data}:{id:string,data:any}){
    return this.http.put(this.BASE_URL + `/update-finding-description/${id}`,data);
  }
  
}
