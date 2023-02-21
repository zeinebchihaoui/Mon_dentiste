import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignaturePadModule } from 'angular2-signaturepad';

import { Q1csPageRoutingModule } from './q1cs-routing.module';
import { Q1csPage } from './q1cs.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    Q1csPageRoutingModule,
    SignaturePadModule
  ],
  declarations: [Q1csPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class Q1csPageModule { }
