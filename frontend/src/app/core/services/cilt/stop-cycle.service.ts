import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/response.models';

export interface StopCycleType {
  id: number;
  start_date: string;
  end_date: string;
  reason_stop: string;
  area: string;
}

@Injectable({
  providedIn: 'root'
})
export class StopCycleService {
  readonly baseApi = environment.baseApi2 + '/api/stop-cycle';

  constructor(private http: HttpClient) { }

  getData(page: number, areaId: string): Observable<{ rows: StopCycleType[], count: number }> {
    const params = {
      page,
      area_id: areaId
    };

    return this.http.get<Response>(this.baseApi, { params }).pipe(
      map(res => ({
        rows: res.data.rows,
        count: res.data.count
      }))
    );
  }

  createData(data: Omit<StopCycleType, "id" | "cycle">) {
    return this.http.post(this.baseApi, data);
  }

  updateData(id: number, data: Omit<StopCycleType, "id" | "cycle">) {
    return this.http.put(`${this.baseApi}/${id}`, data);
  }

  deleteData(id: number) {
    return this.http.delete(`${this.baseApi}/${id}`);
  }
}
