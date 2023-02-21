import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPhotoPageRoutingModule } from './add-photo-routing.module';

import { AddPhotoPage } from './add-photo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPhotoPageRoutingModule
  ],
  declarations: [AddPhotoPage]
})
export class AddPhotoPageModule {}
