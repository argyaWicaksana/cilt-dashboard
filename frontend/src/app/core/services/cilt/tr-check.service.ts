import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../auth.service';

export interface TrCheckType {
  id: number;
  area: string;
  areaId: number;
  sectionId: number
  subSection: string;
  location: string;
  cycle: string;
  activity: string;
  standard: string;
}

export interface ProgressCiltType {
  finish: number;
  total: number;
  sub_section: string;
  cycle: string;
  reason_stop?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrCheckService {
  readonly baseApi = environment.baseApi2 + '/api/task-check';

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getData(page: number, area = 0, section = 0, activity = '', sub_section = 0) {
    const params = {
      page,
      ...(area > 0 ? { area } : {}),
      ...(section > 0 ? { section } : {}),
      ...(sub_section > 0 ? { sub_section } : {}),
      ...(activity ? { activity } : {})
    };
    return this.http.get<{ data: any }>(this.baseApi, { params }).pipe(
      map(({ data }): { rows: TrCheckType[], count: number } => {
        const rows = data.rows.map((d: any) => ({
          id: d.id,
          area: d.mst_check.mst_lokasi.mst_sub_section.mst_section.area.name,
          areaId: d.mst_check.mst_lokasi.mst_sub_section.mst_section.area.id,
          sectionId: d.mst_check.mst_lokasi.mst_sub_section.mst_section.id,
          subSection: d.mst_check.mst_lokasi.mst_sub_section.name,
          location: d.mst_check.mst_lokasi.name,
          cycle: d.mst_cycle.cycle,
          activity: d.mst_check.activity,
          standard: d.mst_check.standard,
        }));
        const count = data.count;

        return {
          rows, count
        }
      })
    )
  }

  createReport(formData: FormData) {
    return this.http.put(this.baseApi, formData);
  }

  getProgressCilt(areaId: number, yearMonth: string) {
    return this.http.get<{ data: ProgressCiltType[] }>(`${this.baseApi}/progress-cilt/${areaId}/${yearMonth}`);
  }

  getCurrentCycle(areaId: number) {
    return this.http.get<{ data: any }>(`${this.baseApi}/current-cycle/${areaId}`);
  }

  getAllCycle(areaId: number, yearMonth: string) {
    return this.http.get<{ data: any }>(`${this.baseApi}/all-cycle/${areaId}/${yearMonth}`);
  }
}
