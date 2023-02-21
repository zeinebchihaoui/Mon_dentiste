import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeadlinePageRoutingModule } from './deadline-routing.module';

import { DeadlinePage } from './deadline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeadlinePageRoutingModule
  ],
  declarations: [DeadlinePage]
})
export class DeadlinePageModule {}
