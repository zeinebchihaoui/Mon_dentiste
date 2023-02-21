import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/core/services/patient.service';
import { IonLoaderService } from '../core/services/ion-loader.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { FamilyUsersPage } from '../family-users/family-users.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';

@Component({
  selector: 'app-patient-account',
  templateUrl: './patient-account.page.html',
  styleUrls: ['./patient-account.page.scss'],
})
export class PatientAccountPage implements OnInit {

  patientForm: FormGroup;
  isSubmitted = false;
  urlDirection: string;
  constructor(
    private modalController: ModalController,
    private patientService: PatientService,
    private ionLoaderService: IonLoaderService,
    public modalCtrl: ModalController,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public toastController: ToastController
  ) {
    this.urlDirection = navParams.get('urlDirection');
  }

  ngOnInit() {
    console.log('urlDirection', this.urlDirection);
    this.patientForm = this.formBuilder.group({
      mailAddress: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    });
  }


  get patientcontrol() {
    return this.patientForm.controls;
  }

  dismiss() {
    this.modalController.dismiss();
  }


  submit() {
    console.log('this.patientForm.value', this.patientForm.value);
    this.isSubmitted = true;
    if (!this.patientForm.valid) {
      return false;
    } else {
      if (this.urlDirection) {
        this.resetPassword();
      } else {
        this.getPatientAccount();
      }
    }
  }


  getPatientAccount() {
    this.ionLoaderService.startLoader();
    this.authService.getPatientsRelatedToAccount(this.patientForm.value.mailAddress)
      .then((res: any) => {
        console.log('data', res);
        this.ionLoaderService.stopLoader();
        this.modalController.dismiss();
        if (res) {
          this.openFamilyUsers(res);
        }
      },
        (error: Error) => {
          console.log('error', error);
          this.ionLoaderService.stopLoader();
          this.presentToast('Vous avez déjà un compte ou email incorrect');
          this.modalController.dismiss();
        });
  }

  resetPassword() {
    this.ionLoaderService.startLoader();
    this.authService.forgottePasswordWithMail(this.patientForm.value.mailAddress)
      .then((res: any) => {
        console.log('data', res);
        this.ionLoaderService.stopLoader();
        this.modalController.dismiss();
        if (res) {
          this.openResetPasswordPage();
        }
      },
        (error: Error) => {
          console.log('error', error);
          this.ionLoaderService.stopLoader();
          this.presentToast('Vous avez déjà un compte ou email incorrect');
          this.modalController.dismiss();
        });
  }

  async openFamilyUsers(users?: any[]) {
    const modal = await this.modalCtrl.create({
      component: FamilyUsersPage,
      componentProps: {
        users,
        mod: 'md'
      },
    });
    return await modal.present();
  }

  async openResetPasswordPage() {
    const modal = await this.modalCtrl.create({
      component: ResetPasswordPage,
      mode: 'md'
    });
    return await modal.present();
  }


  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000
    });
    toast.present();
  }

}
