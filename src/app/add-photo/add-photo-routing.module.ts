import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPhotoPage } from './add-photo.page';

const routes: Routes = [
  {
    path: '',
    component: AddPhotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPhotoPageRoutingModule {}
