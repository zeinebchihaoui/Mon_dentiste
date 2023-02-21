import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyUsersPage } from './family-users.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyUsersPageRoutingModule {}
