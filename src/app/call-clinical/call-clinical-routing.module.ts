import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallClinicalPage } from './call-clinical.page';

const routes: Routes = [
  {
    path: '',
    component: CallClinicalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallClinicalPageRoutingModule {}
