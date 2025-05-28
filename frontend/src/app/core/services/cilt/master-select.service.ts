import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterSelectService {
  private readonly nik: string;
  readonly baseApi = environment.baseApi2 + '/api/master-select';

  constructor(private http: HttpClient, authService: AuthenticationService) {
    this.nik = authService.currentUser!.lg_nik;
  }

  getEmployees(page = 1, search: string, user_level: number[] = []) {
    const params = {
      page,
      ...(search ? { search } : {}),
      ...(user_level.length > 0 ? { user_level } : {}),
    };
    return this.http.get<{ data: any[] }>(this.baseApi + '/employees', { params }).pipe(
      map((res) => res.data)
    );
  }

  getSections(areaId: number) {
    const params = {
      ...(this.nik !== '0000' ? { nik: this.nik } : {}),
      area_id: areaId
    };
    return this.http.get<{ data: any[] }>(this.baseApi + '/section/', { params }).pipe(
      map(({ data }) => data),
      catchError(this.handleError<[]>([]))
    )
  }

  getSubSections(sectionId = 0, areaId = 0) {
    const params = {
      ...(sectionId ? { section_id: sectionId } : {}),
      ...(areaId ? { area_id: areaId } : {}),
    };
    return this.http.get<{ data: any[] }>(this.baseApi + '/sub-section/', { params }).pipe(
      map(({ data }) => data),
      catchError(this.handleError<[]>([]))
    )
  }

  getLocations(subSectionId: number) {
    const params = {
      sub_section_id: subSectionId
    };
    return this.http.get<{ data: any[] }>(this.baseApi + '/location/', { params }).pipe(
      map(({ data }) => data),
      catchError(this.handleError<[]>([]))
    )
  }

  getCycle(month: number, year: number) {
    const params = {
      month,
      year,
      ...(this.nik !== '0000' ? { nik: this.nik } : {})
    };
    return this.http.get<{ data: any[] }>(this.baseApi + '/cycle', { params }).pipe(
      map(({ data }) => data),
      catchError(this.handleError<[]>([]))
    )
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
