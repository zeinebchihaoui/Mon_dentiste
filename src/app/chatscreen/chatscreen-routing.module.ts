import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatscreenPage } from './chatscreen.page';

const routes: Routes = [
  {
    path: '',
    component: ChatscreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatscreenPageRoutingModule {}
