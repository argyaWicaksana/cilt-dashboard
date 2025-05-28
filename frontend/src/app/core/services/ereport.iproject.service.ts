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
export class EreportIprojectService {
  readonly BASE_URL = environment.baseUrl + "/e-report";

  constructor(private http: HttpClient) {}

  getItemProjects(params?: any) {
    return this.http.get(this.BASE_URL + `/item-project`, {
      params,
    });
  }

  getItemProjectsById(id: string) {
    return this.http.get(this.BASE_URL + `/item-project/${id}`);
  }

  postItemProject(data: any) {
    console.log(`data`, data);
    return this.http.post(this.BASE_URL + `/item-project/create`, data);
  }

  postActivityProject({ id, data }: { id: string; data: any }) {
    return this.http.post(
      this.BASE_URL + `/item-project/${id}/progress/create`,
      data
    );
  }

  updateItemProjectData({ id, data }: { id: string; data: any }) {
    return this.http.put(this.BASE_URL + `/item-project/edit/${id}`, data);
  }

  deleteItemProjectData(id: string) {
    return this.http.delete(this.BASE_URL + `/item-project/${id}`);
  }

  getImageUrl(image: string) {
    return `${environment.baseUrlRaw}/e-report/item-project/${image}`;
  }

  updateProgressPercentage({ id, data }: { id: string; data: any }) {
    return this.http.put(
      this.BASE_URL + `/item-project/update-progress/${id}`,
      data
    );
  }

  getAreas() {
    return this.http.get(this.BASE_URL + `/item-project/areas`);
  }

  getOtCategory() {
    return this.http.get(this.BASE_URL + `/item-project/ot-category`);
  }

  getIpReportingGeneral({ year }: { year: string }) {
    return this.http.get(this.BASE_URL + `/item-project/reporting/general`, {
      params: {
        year,
      },
    });
  }

  getIpReportingMonthly({ year }: { year: string }) {
    return this.http.get(this.BASE_URL + `/item-project/reporting/monthly`, {
      params: {
        year,
      },
    });
  }

  getIpReportingMothlyLine({ month, year }: { month: string; year: string }) {
    return this.http.get(
      this.BASE_URL + `/item-project/reporting/monthly-line`,
      {
        params: {
          month,
          year,
        },
      }
    );
  }

  // Time comparator
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
  downloadData(params: any) {
    console.log(`params`, params);
    return `${this.BASE_URL}/item-project/download-ot?year=${params.year}&month=${params.month}`
  }

  updatePhotoActivity(id:any,data:any){
    return this.http.put(this.BASE_URL + `/item-project/update-photo-activity/${id}`,data);
  }
}
