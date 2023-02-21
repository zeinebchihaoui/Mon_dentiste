import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { IonLoaderService } from '../core/services/ion-loader.service';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { FamilyUsersPage } from '../family-users/family-users.page';
import { PatientAccountPage } from '../patient-account/patient-account.page';
export interface Contact {
  id: number;
  id_PERSONNE: number;
  contacttype: number;
  value: string;
  libelle: string;
  is_MAIN: string;
  id_CONTACTLIBELLE: number;
  adr1: string;
  adr2: string;
  codepostal: string;
  ville: string;
  pref_ORDER: number;
  pays: string;
  id_PAYS: number;
  indicatif: number;
  sms: number;
}

export enum contactType {
  Inconnue = -1,
  Telephone = 1,
  Mail = 2,
  Fax = 3,
  Adresse = 4
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  section = 'signin';
  selectedClinical = 'bergues';
  role: string;
  isSubmittedRegister = false;
  isSubmittedLogin = false;
  contacts: Contact[] = [];
  pays = [];
  showPassword = false;

  constructor(private authService: AuthService,
              private storage: StorageService,
              private patientService: PatientService,
              private formBuilder: FormBuilder,
              private ionLoaderService: IonLoaderService,
              private alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private router: Router) {
  }

  ngOnInit() {
    this.createForm();
    this.getAllPays();
  }

  onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      cabinet: ['bergues', Validators.required]
    });

    this.registerForm = this.formBuilder.group({

      mail: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      naissance: ['', Validators.required],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
      mdp2: ['', [Validators.required]],
      sexe: ['',],
      role: [''],
      titre: ['', Validators.required],
      cabinet: ['', Validators.required],
      idPays: ['170',],
    }, {
      validator: [
        this.MustMatch('mdp', 'mdp2'),
      ]
    });
    if (this.pays.length) {
      const paysSuisse = this.pays[0].id_pays.toString();
      this.registerForm.controls.idPays.setValue(paysSuisse);
    }

  }

  get registercontrol() {
    return this.registerForm.controls;
  }

  get logincontrol() {
    return this.loginForm.controls;
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

  getAllPays() {
    this.authService.getAllPays()
      .then((pays: any) => {
        this.pays = pays;
      });
  }

  onSubmit() {
    console.log('this.loginForm.value', this.loginForm.value);
    this.storage.setObject('clinic', this.loginForm.value.cabinet);
    this.isSubmittedLogin = true;
    if (!this.loginForm.valid) {
      return false;
    } else {
      this.ionLoaderService.startLoader();
      this.authService.login(this.loginForm.value)
        .then((res: any) => {
            console.log('data', res);
            if (res && res.listPersonne && res.listPersonne.length) {
              this.openFamilyUsers(res.listPersonne);
            } else {
              this.getPatientData(res.personne.id_personne);
            }
            this.ionLoaderService.stopLoader();
          },
          (error: Error) => {
            console.log('error', error);
            this.showAlert('Verifier votre address email and mot de pass');
            this.ionLoaderService.stopLoader();
          });
    }
  }

  async openFamilyUsers(users: any[]) {
    const modal = await this.modalCtrl.create({
      component: FamilyUsersPage,
      componentProps: {
        users,
      },
      mode: 'md'
    });
    return await modal.present();
  }

  getPatientData(idPersonne: number) {
    this.ionLoaderService.startLoader();
    this.patientService.getPatientData(idPersonne, '')
      .then(responseList => {
        console.log('🚀 ~ file: login.page.ts ~ line 192 ~ LoginPage ~ getPatientData ~ responseList', responseList);
        this.storage.setObject('attributs', responseList[0]);
        this.storage.setObject('gabarits', responseList[1]);
        this.storage.setObject('actes', responseList[2]);
        this.storage.setObject('praticiens', responseList[3]);
        this.storage.setObject('patientData', responseList[4]);
        (responseList[5][0]) ? this.storage.setObject('nextRdv', responseList[5][0])
          : this.storage.setObject('nextRdv', {});
        this.storage.setObject('patientData', responseList[5]);
        this.router.navigate(['/welcome']);
        this.ionLoaderService.stopLoader();
      }, (error: Error) => {
        console.log('error', error);
        this.ionLoaderService.stopLoader();
      });
  }

  showAlert(msg) {
    const alert = this.alertCtrl.create({
      header: 'Erreur',
      message: msg,
      buttons: ['OK'],
      mode: 'md'
    });
    alert.then(x => x.present());
  }

  register() {
    console.log('this.registerForm.value', this.registerForm.value);
    this.isSubmittedRegister = true;
    if (!this.registerForm.valid) {
      return false;
    } else {
      const user = this.registerForm.getRawValue();
      this.ionLoaderService.startLoader();
      console.log('user', user);
      this.authService.registerUser(user)
        .then((res: any) => {
            console.log('res', res);
            if (res) {
              // this.getPatientData(res.personne.id_personne);
              this.registerForm.reset();
              this.isSubmittedRegister = false;
              this.section = 'signin';
              //this.insertContacts(this.registerForm.value, res.personne.id_personne);
            }
            this.ionLoaderService.stopLoader();
          },
          (error: Error) => {
            console.log('error', error);
            this.ionLoaderService.stopLoader();
          });
    }
  }

  insertContacts(form, id) {
    let contactTel: Contact;
    contactTel.id_CONTACTLIBELLE = 1;
    contactTel.contacttype = contactType.Telephone;
    contactTel.id_PERSONNE = id;
    contactTel.id_PAYS = form.idPays;
    contactTel.indicatif = form.idPays;
    contactTel.value = form.telephone;

    let contactMail: Contact;
    contactMail.id_CONTACTLIBELLE = 7;
    contactMail.contacttype = contactType.Mail;
    contactMail.id_PERSONNE = id;
    contactMail.value = form.mail.toLowerCase();

    this.contacts.push(contactTel);
    this.contacts.push(contactMail);

    this.authService.insertContact(this.contacts).then(res => {
      console.log('res', res);
    });
  }





  /** Patient Account  */

  async openPatientAccount(url?: string) {
    const modal = await this.modalCtrl.create({
      component: PatientAccountPage,
      componentProps: {
        urlDirection: url,
      },
      mode: 'md'

    });
    return await modal.present();
  }

}
