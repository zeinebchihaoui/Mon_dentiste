import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullviewPage } from './fullview.page';

const routes: Routes = [
  {
    path: '',
    component: FullviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullviewPageRoutingModule {}
