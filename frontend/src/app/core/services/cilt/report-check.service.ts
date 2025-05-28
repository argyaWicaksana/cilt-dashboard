import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../auth.service';

export interface ReportCheckType {
  id: number;
  area: string;
  sub_section: string;
  location: string;
  activity: string;
  standard: string;
  cycle: string;
  date_check: string;
  result: 'ok' | 'ng';
  photo: string;
  pic: string;
  note: string;
  reason_postpone: string | null;
}

export interface ProgressReport {
  total_tasks: number;
  done_tasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportCheckService {
  readonly baseApi = environment.baseApi2 + '/api/finished-check';

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getData(page: number, cycle = 0, monthYear = '', area = 0, section = 0, activity = '') {
    const params = {
      page,
      ...(cycle ? { cycle } : {}),
      ...(monthYear ? { month_year: monthYear } : {}),
      ...(area > 0 ? { area } : {}),
      ...(section > 0 ? { section } : {}),
      ...(activity ? { activity } : {}),
    };
    return this.http.get<{ data: any }>(this.baseApi, { params }).pipe(
      map(({ data }) => {

        return { rows: data.rows, count: data.count };
      })
    )
  }

  getProgress(month: number, year: number) {
    return this.http.get<{data: ProgressReport}>(`${this.baseApi}/progress/${year}-${month}`);
  }

  updateData(id: number, formData: FormData) {
    return this.http.put(`${this.baseApi}/${id}`, formData);
  }
}
