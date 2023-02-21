import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeadlinePage } from './deadline.page';

const routes: Routes = [
  {
    path: '',
    component: DeadlinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeadlinePageRoutingModule {}
