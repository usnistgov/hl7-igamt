import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { DefaultConfigurationComponent } from "./components/default-configuration/default-configuration.component";

const routes: Routes = [
  {
    path: '',
    component: DefaultConfigurationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportConfigurationRoutingModule { }
