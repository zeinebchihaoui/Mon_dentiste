import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FullviewPageRoutingModule } from './fullview-routing.module';
import { PinchZoomModule } from 'ngx-pinch-zoom';

import { FullviewPage } from './fullview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullviewPageRoutingModule,
    PinchZoomModule

  ],
  declarations: [FullviewPage]
})
export class FullviewPageModule {}
