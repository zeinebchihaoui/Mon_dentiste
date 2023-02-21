import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyUsersPageRoutingModule } from './family-users-routing.module';

import { FamilyUsersPage } from './family-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyUsersPageRoutingModule
  ],
  declarations: [FamilyUsersPage]
})
export class FamilyUsersPageModule {}
