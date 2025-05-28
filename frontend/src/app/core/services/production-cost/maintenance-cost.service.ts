import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceCostService {
  readonly baseApi = environment.baseApi2 + '/production-cost/cost-maintenance';

  constructor(private http: HttpClient) { }

  getCostOrder(area: string, page = 1, category = '', year = '', type = '') {
    const params = {
      page,
      ...(category ? { category } : {}),
      ...(year ? { year } : {}),
      ...(type ? { type } : {})
    };
    return this.http.get<{ data: any, count: number }>(`${this.baseApi}/cost-order/${area}`, { params });
  }

  createCostOrder(data: any) {
    return this.http.post<{ message: string }>(`${this.baseApi}/cost-order`, data);
  }

  updateCostOrder(id: number, data: any) {
    return this.http.put<{ message: string }>(`${this.baseApi}/cost-order/${id}`, data);
  }

  deleteCostOrder(id: number, area: string) {
    return this.http.delete<{ message: string }>(`${this.baseApi}/cost-order/${area}/${id}`);
  }

  getFinishGood(area: string, page = 1, year = '') {
    const params = {
      page,
      ...(year ? { year } : {})
    };
    return firstValueFrom(this.http.get<{ data: any, count: number }>(`${this.baseApi}/finish-good/${area}`, { params }));
  }

  createFg(data: any) {
    return this.http.post<{ message: string }>(`${this.baseApi}/finish-good`, data);
  }

  updateFg(id: number, data: any) {
    return this.http.put<{ message: string }>(`${this.baseApi}/finish-good/${id}`, data);
  }

  deleteFg(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseApi}/finish-good/${id}`);
  }
}
