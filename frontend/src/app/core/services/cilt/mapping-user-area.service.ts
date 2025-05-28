import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface MappingUserAreaType {
  id: number;
  lg_nik: string;
  lg_name: string;
  user_level_name: string;
  mst_area: { id: number, area: string }
  mst_section: { id: number, section: string }
}

@Injectable({
  providedIn: 'root'
})
export class MappingUserAreaService {
  readonly baseApi = environment.baseApi2 + '/api/mapping-user-area';

  constructor(private http: HttpClient) { }

  getData(page: number, search = '') {
    const params = {
      page,
      search
    };
    return this.http.get<{ data: any }>(this.baseApi, { params });
  }

  createData(data: any) {
    return this.http.post(this.baseApi, data);
  }

  updateData(id: number, data: any) {
    return this.http.put(`${this.baseApi}/${id}`, data);
  }

  deleteData(id: number) {
    return this.http.delete(`${this.baseApi}/${id}`);
  }
}
