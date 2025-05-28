import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuppliesService {
  readonly baseApi = environment.baseApi2 + '/production-cost/supplies';

  constructor(private http: HttpClient) { }

  getMaterial(page = 1, search = '', year = '') {
    const params = {
      page,
      ...(search ? { search } : {}),
      ...(year ? { year } : {}),
    };
    return firstValueFrom(this.http.get<{ data: any }>(this.baseApi + '/material', { params }));
  }

  createMaterial(data: any) {
    return firstValueFrom(this.http.post<{ message: string }>(this.baseApi + '/material', data));
  }

  updateMaterial(data: any, id: number) {
    return firstValueFrom(this.http.put<{ message: string }>(this.baseApi + '/material/' + id, data));
  }

  deleteMaterial(id: number) {
    return firstValueFrom(this.http.delete<{ message: string }>(this.baseApi + '/material/' + id));
  }

  getCostCenter(page = 0, area_id = 0) {
    const params = {
      ...(page ? { page } : {}),
      ...(area_id != 0 ? { area_id } : {})
    };

    return firstValueFrom(this.http.get<{ data: any }>(this.baseApi + '/cost-center', { params }));
  }

  createCostCenter(data: any) {
    return firstValueFrom(this.http.post<{ message: string }>(this.baseApi + '/cost-center', data));
  }

  updateCostCenter(data: any, id: number) {
    return firstValueFrom(this.http.put<{ message: string }>(this.baseApi + '/cost-center/' + id, data));
  }

  deleteCostCenter(id: number) {
    return firstValueFrom(this.http.delete<{ message: string }>(this.baseApi + '/cost-center/' + id));
  }

  getBudgetPlan(page = 1, month_year = '', cost_center = '') {
    const params = {
      page,
      ...(month_year ? { month_year } : {}),
      ...(cost_center ? { cost_center } : {}),
    };

    return firstValueFrom(this.http.get<{ data: any }>(this.baseApi + '/budget-plan', { params }));
  }

  createBudgetPlan(data: any) {
    return firstValueFrom(this.http.post<{ message: string }>(this.baseApi + '/budget-plan', data));
  }

  updateBudgetPlan(data: any, id: number) {
    return firstValueFrom(this.http.put<{ message: string }>(this.baseApi + '/budget-plan/' + id, data));
  }

  deleteBudgetPlan(id: number) {
    return firstValueFrom(this.http.delete<{ message: string }>(this.baseApi + '/budget-plan/' + id));
  }
}
