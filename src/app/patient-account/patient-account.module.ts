import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientAccountPageRoutingModule } from './patient-account-routing.module';

import { PatientAccountPage } from './patient-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PatientAccountPageRoutingModule
  ],
  declarations: [PatientAccountPage]
})
export class PatientAccountPageModule {}
