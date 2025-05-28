import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../auth.service';

export interface ExpiredCheckType {
  id: number;
  area: string;
  subSection: string;
  location: string;
  cycle: string;
  activity: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpiredCheckService {
  readonly baseApi = environment.baseApi2 + '/api/expired-check';

  constructor(private http: HttpClient) { }

  getData(page: number, area = 0, section = 0) {
    const params = {
      page,
      ...(area > 0 ? { area } : {}),
      ...(section > 0 ? { section } : {})
    };
    return this.http.get<{ data: any }>(this.baseApi, { params }).pipe(
      map(({ data }) => {
        const { rows, count } = data;

        return { rows, count };
      })
    );
  }

  postponeCycle(id_tr: number, cycle: number, reason_postpone: string) {
    const body = {
      id_tr,
      cycle,
      reason_postpone
    }
    return this.http.post(this.baseApi, body);
  }

  currentCycle(area: string) {
    const areaId = area === 'OCI-1' ? 1 : (area === 'OCI-2' ? 2 : 3);

    return this.http.get<any>(environment.baseApi2 + '/api/master-check/current-cycle/' + areaId);
  }
}
