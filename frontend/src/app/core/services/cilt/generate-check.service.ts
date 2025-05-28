import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerateCheckService {
  readonly baseApi = environment.baseApi2 + '/api/generate-check';

  constructor(private http: HttpClient) { }

  generateCheck() {
    return this.http.get(this.baseApi);
  }
}
