import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrpService {
  readonly baseApi = environment.baseApi2 + '/production-cost/crp';

  constructor(private http: HttpClient) { }

  getCategory() {
    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/category`));
  }

  getItemCrp(page = 1, area: string, year: string) {
    const params = {
      page,
      ...(area ? { area } : {}),
      ...(year ? { year } : {}),
    };
    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/master`, { params }));
  }

  createItemCrp(data: any) {
    return firstValueFrom(this.http.post<{ message: string }>(`${this.baseApi}/master`, data));
  }

  updateItemCrp(id: number, data: any) {
    return firstValueFrom(this.http.put<{ message: string }>(`${this.baseApi}/master/${id}`, data));
  }

  deleteItemCrp(id: number) {
    return firstValueFrom(this.http.delete<{ message: string }>(`${this.baseApi}/master/${id}`));
  }

  getProgressCrp(crp_id: number) {
    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/progress/${crp_id}`));
  }

  createProgressCrp(data: any) {
    return firstValueFrom(this.http.post<{ message: string }>(`${this.baseApi}/progress`, data));
  }

  updateProgressCrp(id: number, data: any) {
    return firstValueFrom(this.http.put<{ message: string }>(`${this.baseApi}/progress/${id}`, data));
  }

  deleteProgressCrp(id: number) {
    return firstValueFrom(this.http.delete(`${this.baseApi}/progress/${id}`));
  }
}
