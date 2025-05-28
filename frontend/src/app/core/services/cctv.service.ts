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
export class CCTVService {
  readonly BASE_URL = environment.baseUrl + '/cctv'

  constructor(private http: HttpClient) {}

  getImageUrl(image: string) {
    return `${environment.baseUrlRaw}/cctv/${image}`;
  }

  getGeneralCCTVData(){
    return this.http.get(this.BASE_URL);
  }

  getGeneralCCTVDataId(id: string){
    return this.http.get(this.BASE_URL + `/${id}`);
  }

  getMonitoringCCTVData(){
    return this.http.get(this.BASE_URL + '/monitoring');
  }

  getMonitoringCCTVDataId(id: string){
    return this.http.get(this.BASE_URL + `/monitoring/${id}`);
  }

  createMonitoringCCTVData(data: any){
    return this.http.post(this.BASE_URL + '/monitoring/create', data);
  }

  updateMonitoringCCTVData(id: string, data: any){
    return this.http.put(this.BASE_URL + `/monitoring/edit/${id}`, data);
  }

  deleteMonitoringCCTVData(id: string){
    return this.http.delete(this.BASE_URL + `/monitoring/delete/${id}`);
  }

  // Area

  getAreaCCTVData(){
    return this.http.get(this.BASE_URL + '/area');
  }

  getAreaCCTVDataId(id: string){
    return this.http.get(this.BASE_URL + `/area/${id}`);
  }

  createAreaCCTVData(data: any){
    return this.http.post(this.BASE_URL + '/area/create', data);
  }

  updateAreaCCTVData(id: string, data: any){
    return this.http.put(this.BASE_URL + `/area/edit/${id}`, data);
  }

  deleteAreaCCTVData(id: string){
    return this.http.delete(this.BASE_URL + `/area/${id}`);
  }
}
