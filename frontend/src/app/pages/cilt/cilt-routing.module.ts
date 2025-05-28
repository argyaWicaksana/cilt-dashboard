import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterCheckComponent } from './master-check/master-check.component';
import { CiltCheckComponent } from './cilt-check/cilt-check.component';
import { ExpiredCheckComponent } from './expired-check/expired-check.component';
import { ReportCheckComponent } from './report-check/report-check.component';
import { StopCycleComponent } from './stop-cycle/stop-cycle.component';
import { AMAccessGuard } from 'src/app/core/guards/am-access.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { RandomCheckComponent } from './random-check/random-check.component';
import { AMRoles } from '../../core/helpers/role-map';
import { GenerateCheckComponent } from './generate-check/generate-check.component';
import { MappingUserAreaComponent } from './mapping-user-area/mapping-user-area.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "master-check",
    component: MasterCheckComponent,
    canActivate: [AMAccessGuard],
    data: {
      allowedRoles: [AMRoles.ADMIN, AMRoles.PLANNER]
    }
  },
  {
    path: 'master-data',
    children: [
      {
        path: 'master-check',
        component: MasterCheckComponent,
        canActivate: [AMAccessGuard],
        data: {
          allowedRoles: [AMRoles.ADMIN, AMRoles.PLANNER]
        }
      },
      {
        path: 'mapping-user-area',
        component: MappingUserAreaComponent,
        canActivate: [AMAccessGuard],
        data: {
          allowedRoles: [AMRoles.ADMIN]
        }
      },
      // { path: 'finish-good/:area', component: FinishGoodComponent },
    ],
  },
  {
    path: "cilt-check",
    component: CiltCheckComponent,
    canActivate: [AMAccessGuard],
    data: {
      allowedRoles: [AMRoles.ADMIN, AMRoles.OPERATOR, AMRoles.PLANNER]
    }
  },
  {
    path: "expired-check",
    component: ExpiredCheckComponent,
    canActivate: [AMAccessGuard],
    data: {
      allowedRoles: [AMRoles.ADMIN, AMRoles.PLANNER]
    }
  },
  {
    path: "report-check",
    component: ReportCheckComponent
  },
  {
    path: "stop-cycle",
    component: StopCycleComponent,
    canActivate: [AMAccessGuard],
    data: {
      allowedRoles: [AMRoles.ADMIN, AMRoles.PLANNER]
    }
  },
  // {
  //   path: "generate-check",
  //   component: GenerateCheckComponent,
  //   canActivate: [AMAccessGuard],
  //   data: {
  //     allowedRoles: [AMRoles.ADMIN]
  //   }
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CiltRoutingModule { }
