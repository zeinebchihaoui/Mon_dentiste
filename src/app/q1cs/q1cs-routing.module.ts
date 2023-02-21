import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Q1csPage } from './q1cs.page';

const routes: Routes = [
  {
    path: '',
    component: Q1csPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Q1csPageRoutingModule {}
