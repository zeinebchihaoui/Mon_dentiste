import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/core/services/patient.service';
import { IonLoaderService } from '../core/services/ion-loader.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetForm: FormGroup;
  isSubmitted = false;
  resetpassw: string;

  constructor(
    private modalController: ModalController,
    private patientService: PatientService,
    private ionLoaderService: IonLoaderService,
    public modalCtrl: ModalController,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public toastController: ToastController
  ) { }


  dismiss() {
    this.modalController.dismiss();
  }


  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      resetpassw: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
    }, {
      validator: [
        this.MustMatch('password', 'passwordConfirm'),
      ]
    });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      // return null if controls haven't initialised yet
      if (!control || !matchingControl) {
        return null;
      }
      // return null if another validator has already found an error on the matchingControl
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }


  get resetcontrol() {
    return this.resetForm.controls;
  }

  submit() {
    console.log('this.resetForm.value', this.resetForm.value);
    this.isSubmitted = true;
    if (!this.resetForm.valid) {
      return false;
    } else {
      this.ionLoaderService.startLoader();
      this.authService.passwordReset(this.resetForm.value.resetpassw, this.resetForm.value.password)
        .then((res: any) => {
          console.log('data', res);
          this.ionLoaderService.stopLoader();
          this.presentToast('Mot de passe changé avec succès');
          this.modalController.dismiss();
        },
          (error: Error) => {
            console.log('error', error);
            this.ionLoaderService.stopLoader();
            this.presentToast('Mot de passe saisie incorrect');
            this.modalController.dismiss();
          });
    }
  }


  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000
    });
    toast.present();
  }

}
