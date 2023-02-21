import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoCategoryPage } from './photo-category.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoCategoryPageRoutingModule {}
