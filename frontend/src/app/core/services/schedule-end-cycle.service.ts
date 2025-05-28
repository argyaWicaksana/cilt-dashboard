import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleEndCycleService {
  readonly baseApi = environment.baseApi2 + '/schedule-end-cycle';

  constructor(
    private http: HttpClient
  ) { }

  getStandardActivity(maintenance_type = '', area = '') {
    const params = {
      ...(maintenance_type ? { maintenance_type } : {}),
      ...(area ? { area } : {})
    };
    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/standard-activity`, { params }));
  }

  getSchedule(page = 1, area_id = 0) {
    const params = {
      page,
      ...(area_id != 0 ? { area_id } : {})
    };

    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/schedule`, { params }));
  }

  getScheduleDetail(id: number) {
    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/schedule/${id}`));
  }

  getActivity(headerId: number) {
    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/activity/${headerId}`));
  }

  createSchedule(data: any) {
    return firstValueFrom(this.http.post(`${this.baseApi}/schedule`, data));
  }

  updateSchedule(headerId: number, data: any) {
    return firstValueFrom(this.http.put<{ message: string }>(`${this.baseApi}/schedule/${headerId}`, data));
  }

  deleteSchedule(id: number) {
    return firstValueFrom(this.http.delete<{ message: string }>(`${this.baseApi}/schedule/${id}`));
  }

  setActualTime(id: number, data: any) {
    return firstValueFrom(this.http.put<{ message: string }>(`${this.baseApi}/schedule-actual/${id}`, data));
  }

  createStandardActivity(data: any) {
    return firstValueFrom(this.http.post<{ message: string }>(`${this.baseApi}/standard-activity`, data));
  }

  updateStandardActivity(id: number, data: any) {
    return firstValueFrom(this.http.put<{ message: string }>(`${this.baseApi}/standard-activity/${id}`, data));
  }

  updateStepStandardActivity(data: any) {
    return firstValueFrom(this.http.put<{ message: string }>(`${this.baseApi}/standard-activity/step`, data));
  }

  deleteStandardActivity(id: number) {
    return firstValueFrom(this.http.delete<{ message: string }>(`${this.baseApi}/standard-activity/${id}`));
  }

  getMaintenanceType() {
    return firstValueFrom(this.http.get<{ data: any }>(`${this.baseApi}/maintenance-type`));
  }

  createMaintenanceType(data: any) {
    return firstValueFrom(this.http.post<{ message: string }>(`${this.baseApi}/maintenance-type`, data));
  }

  updateMaintenanceType(id: number, data: any) {
    return firstValueFrom(this.http.put<{ message: string }>(`${this.baseApi}/maintenance-type/${id}`, data));
  }

  deleteMaintenanceType(id: number) {
    return firstValueFrom(this.http.delete<{ message: string }>(`${this.baseApi}/maintenance-type/${id}`));
  }
}
