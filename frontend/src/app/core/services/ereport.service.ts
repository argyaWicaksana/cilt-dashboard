import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` })
};


@Injectable({
  providedIn: 'root'
})
export class EreportService {
  readonly BASE_URL = environment.baseUrl + '/e-report/general-oc'

  constructor(private http: HttpClient) {}

  getImageUrl(image: string) {
    return `${environment.baseUrlRaw}/e-report/${image}`;
  }

  getShift() {
    return this.http.get(this.BASE_URL
      + '/shift_list');
  }

  getGeneralOCData({id,detail}:{id:string,detail: string}) {
    return this.http.get(this.BASE_URL + `/${id}/${detail}`,{
      params: {
        showAll: false,
      }
    });
  }

  getGeneralOCDataId({id,detail,idData}:{id:string,detail: string,idData:string}) {
    return this.http.get(this.BASE_URL
      + `/${id}/${detail}/${idData}`);
  }

  // postOC1Preparation({endpoint , data}) {
  postGeneralOCData({id,detail,data}:{id:string,detail:string , data:any}) {
    return this.http.post(this.BASE_URL + `/${id}/${detail}/create`,data);
  }

  updateGeneralOCData({id,detail,idData,data}:{id:string,detail:string,idData:string,data:any}) {
    return this.http.put(this.BASE_URL
      + `/${id}/${detail}/edit/${idData}`,data);
  }

  deleteGeneralOCData({id,detail,idData}:{id:string,detail:string,idData:string}) {
    return this.http.delete(this.BASE_URL + `/${id}/${detail}/${idData}`);
  }
  
}
