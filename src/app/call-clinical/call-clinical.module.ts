import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallClinicalPageRoutingModule } from './call-clinical-routing.module';

import { CallClinicalPage } from './call-clinical.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallClinicalPageRoutingModule
  ],
  declarations: [CallClinicalPage]
})
export class CallClinicalPageModule {}
