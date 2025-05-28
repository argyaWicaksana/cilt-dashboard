import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "cilt",
    pathMatch: 'full'
  },
  {
    path: "cilt",
    title: "cilt",
    loadChildren: () => import("./cilt/cilt.module").then((m) => m.CiltModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
