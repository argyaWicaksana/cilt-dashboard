import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../auth.service';

export interface MasterCheckType {
  id: number;
  area: {
    id: number,
    name: string
  };
  section: {
    id: number,
    name: string
  };
  subSection: {
    id: number,
    name: string
  };
  activity: string;
  totalCycle: number;
  intervalTime: number;
  machineStatus: boolean;
  currentWeek: number;
  location: {
    id: number,
    name: string
  };
  standard: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterCheckService {
  readonly baseApi = environment.baseApi2 + '/api/master-check';

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getData(page: number, search: string, area = 0, section = 0) {
    const params = {
      page,
      search,
      ...(area > 0 ? { area } : {}),
      ...(section > 0 ? { section } : {})
    };
    return this.http.get<{ data: any }>(this.baseApi, { params }).pipe(
      map(({ data }) => {
        const rows: MasterCheckType[] = data.rows.map((d: any) => ({
          id: d.id,
          area: {
            id: d.mst_lokasi.mst_sub_section.mst_section.area.id,
            name: d.mst_lokasi.mst_sub_section.mst_section.area.name,
          },
          section: {
            id: d.mst_lokasi.mst_sub_section.mst_section.id,
            name: d.mst_lokasi.mst_sub_section.mst_section.name,
          },
          subSection: {
            id: d.mst_lokasi.mst_sub_section.id,
            name: d.mst_lokasi.mst_sub_section.name,
          },
          activity: d.activity,
          totalCycle: d.total_cycle,
          intervalTime: d.interval_time,
          machineStatus: d.machine_status ? 'run' : 'stop',
          currentWeek: d.current_week,
          location: {
            id: d.mst_lokasi.id,
            name: d.mst_lokasi.name,
          },
          standard: d.standard
        }));

        const count: number = data.count;

        return {
          rows,
          count
        };
      }),
    );
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
