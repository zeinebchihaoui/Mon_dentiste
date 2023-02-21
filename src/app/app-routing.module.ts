import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'q1cs',
    loadChildren: () => import('./q1cs/q1cs.module').then(m => m.Q1csPageModule)
  },
  {
    path: 'photo',
    loadChildren: () => import('./photo/photo.module').then(m => m.PhotoPageModule)
  },
  {
    path: 'deadline',
    loadChildren: () => import('./deadline/deadline.module').then(m => m.DeadlinePageModule)
  },
  {
    path: 'appointment',
    loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./chats/chats.module').then(m => m.ChatsPageModule)
  },
  {
    path: 'chatscreen',
    loadChildren: () => import('./chatscreen/chatscreen.module').then(m => m.ChatscreenPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'fullview',
    loadChildren: () => import('./fullview/fullview.module').then(m => m.FullviewPageModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingPageModule)
  },
  {
    path: 'call-clinical',
    loadChildren: () => import('./call-clinical/call-clinical.module').then( m => m.CallClinicalPageModule)
  },
  {
    path: 'family-users',
    loadChildren: () => import('./family-users/family-users.module').then( m => m.FamilyUsersPageModule)
  },
  {
    path: 'preliminary',
    loadChildren: () => import('./preliminary/preliminary.module').then( m => m.PreliminaryPageModule)
  },
  {
    path: 'patient-account',
    loadChildren: () => import('./patient-account/patient-account.module').then( m => m.PatientAccountPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'photo-category',
    loadChildren: () => import('./photo-category/photo-category.module').then( m => m.PhotoCategoryPageModule)
  },
  {
    path: 'add-photo',
    loadChildren: () => import('./add-photo/add-photo.module').then( m => m.AddPhotoPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
