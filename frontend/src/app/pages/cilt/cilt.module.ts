import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CiltRoutingModule } from './cilt-routing.module';
import { MasterCheckComponent } from './master-check/master-check.component';
import { CiltCheckComponent } from './cilt-check/cilt-check.component';
import { ExpiredCheckComponent } from './expired-check/expired-check.component';
import { ReportCheckComponent } from './report-check/report-check.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { StopCycleComponent } from './stop-cycle/stop-cycle.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountToModule } from 'angular-count-to';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RandomCheckComponent } from './random-check/random-check.component';
import { GenerateCheckComponent } from './generate-check/generate-check.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { MappingUserAreaComponent } from './mapping-user-area/mapping-user-area.component';


@NgModule({
  declarations: [
    MasterCheckComponent,
    CiltCheckComponent,
    ExpiredCheckComponent,
    ReportCheckComponent,
    StopCycleComponent,
    DashboardComponent,
    RandomCheckComponent,
    GenerateCheckComponent,
    UserRoleComponent,
    MappingUserAreaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    CiltRoutingModule,
    NgApexchartsModule,
    NgxSpinnerModule,
    NgSelectModule,
    SharedModule,
    FlatpickrModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CiltModule { }
