import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientAccountPage } from './patient-account.page';

const routes: Routes = [
  {
    path: '',
    component: PatientAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientAccountPageRoutingModule {}
