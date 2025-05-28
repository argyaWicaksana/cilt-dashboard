import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LubricationSystemService {
  readonly baseApi = environment.baseApi2 + '/lubricant-information';

  constructor(
    private http: HttpClient
  ) { }

  getOilGrease(area = '', section = '', keyword = '') {
    const params = {
      ...(area ? { area } : {}),
      ...(section ? { section } : {}),
      ...(keyword ? { keyword } : {}),
    }

    return this.http.get<{ data: any }>(`${this.baseApi}/oil-grease`, { params });
  }

  createOilGrease(data: FormData) {
    return this.http.post<{ message: string }>(`${this.baseApi}/oil-grease`, data);
  }

  updateOilGrease(id: number, data: FormData) {
    return this.http.put<{ message: string }>(`${this.baseApi}/oil-grease/${id}`, data);
  }

  deleteOilGrease(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseApi}/oil-grease/${id}`);
  }
}
