import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  readonly baseApi = environment.baseApi2 + '/api/user-role';

  constructor(private http: HttpClient) { }

  getData(page: number, search = '') {
    const params = {
      page,
      search
    };
    return this.http.get(this.baseApi, { params });
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
