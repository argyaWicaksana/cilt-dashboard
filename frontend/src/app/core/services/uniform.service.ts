import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { param } from "jquery";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
};

@Injectable({
  providedIn: "root",
})
export class UniformService {
  readonly BASE_URL = environment.baseUrl + "/uniform";
  readonly BASE_URL_CASCADE = environment.baseUrl + "/uniform/cascade";

  constructor(private http: HttpClient) {}

  getImageUrl(image: string) {
    return `${environment.baseUrlRaw}/uniform/${image}`;
  }

  getGeneralUniformData() {
    return this.http.get(this.BASE_URL + "/general");
  }

  getCascadeDataCategories() {
    return this.http.get(this.BASE_URL_CASCADE + "/categories");
  }
  getCascadeDataItems(categoryId: string) {
    return this.http.get(this.BASE_URL_CASCADE + "/items", {
      params: {
        categoryId: categoryId,
      },
    });
  }
  getCascadeDataSizes(categoryId: string, itemId: string) {
    return this.http.get(this.BASE_URL_CASCADE + "/sizes", {
      params: {
        categoryId: categoryId,
        itemId: itemId,
      },
    });
  }
  getCascadeDataUniform(categoryId: string, itemId: string, sizeId: string) {
    return this.http.get(this.BASE_URL_CASCADE + "/uniform", {
      params: {
        categoryId: categoryId,
        itemId: itemId,
        sizeId: sizeId,
      },
    });
  }
  addStockUniform( data: any) {
    return this.http.post(this.BASE_URL + "/transaction/add-stock", data);
  }
  reduceStockUniform(uniformId: string, amount: any) {
    return this.http.post(this.BASE_URL + "/transaction/reduce-stock", amount, {
      params: {
        uniformId: uniformId,
      },
    });
  }
  destroyUniform(uniformId: string, amount: any) {
    return this.http.post(
      this.BASE_URL + "/transaction/destroy-stock",
      amount,
      {
        params: {
          uniformId: uniformId,
        },
      }
    );
  }
  getReportWeeklyUniform(month: string) {
    return this.http.get(this.BASE_URL + "/general/report-weekly", {
      params: {
        month: month,
      },
    });
  }
  getReportMonthlyUniform(yearMonth: string) {
    return this.http.get(this.BASE_URL + "/general/report-monthly", {
      params: {
        yearMonth: yearMonth,
      },
    });
  }
  getSubmittedReport(yearMonth?: string, status?: string) {
    let realStatus = status ? status : "";
    let realYear = yearMonth ? yearMonth : "";
    return this.http.get(this.BASE_URL + "/general/submitted-report", {
      params: {
        yearMonth: realYear,
        status: realStatus,
      },
    });
  }

  submitReport(month: string, year: string) {
    return this.http.post(this.BASE_URL + "/general/submit-report", {
      month: month,
      year: year,
    });
  }
  approveReport(id: string, statusIndex: number) {
    return this.http.post(this.BASE_URL + "/general/approve-report", {
      id: id,
      statusIndex: statusIndex,
    });
  }
  getDetailTransaction(params: HttpParams){
    return this.http.get(this.BASE_URL + "/transaction/all-detail", {params});
  }
  getUsers(){
    return this.http.get(this.BASE_URL + "/general/users-uniform");
  }
}
