import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RandomCheckService {
  readonly baseApi = environment.baseApi2 + '/cilt/random-check';

  constructor(
    private http: HttpClient
  ) { }

  getData(area: number) {
    return this.http.get<{ data: any }>(`${this.baseApi}/${area}`);
  }

  verifCheck(data: any) {
    return this.http.post(this.baseApi, data);
  }
}
