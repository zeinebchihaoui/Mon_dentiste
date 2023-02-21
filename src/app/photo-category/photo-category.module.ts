import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoCategoryPageRoutingModule } from './photo-category-routing.module';

import { PhotoCategoryPage } from './photo-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoCategoryPageRoutingModule
  ],
  declarations: [PhotoCategoryPage]
})
export class PhotoCategoryPageModule {}
