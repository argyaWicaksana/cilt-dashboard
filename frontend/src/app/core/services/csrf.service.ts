import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  readonly baseApi = environment.baseApi2 + '/api/csrf-token';

  constructor(private http: HttpClient) { }

  async getXsrfToken() {
    return firstValueFrom(this.http.get(this.baseApi));
  }
}
