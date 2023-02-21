import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController, LoadingController, IonInfiniteScroll } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { StorageService } from 'src/app/core/services/storage.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  medicalId: string;
  medicalTitle: string;
  users: any[] = [];
  globalUsers: any[] = [];
  userIdSelected: number;
  startLimit = 0;
  endLimit = 5000;
  userType = 1;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  textSearch = '';

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public userService: UserService,
    private storage: StorageService,
    private loadingCtrl: LoadingController,
  ) {
    this.medicalId = navParams.get('id');
    this.medicalTitle = navParams.get('title');

    this.storage.getObject('praticiens')
      .then((res: any) => {
        this.globalUsers = res;
        this.checkUserType();
        this.users = this.getUsersByType();
      });
  }

  ngOnInit() {

  }

  checkUserType() {
    switch (this.medicalId) {
      case 'attendingDentist':
        this.userType = 8;
        break;
      case 'praticien':
        this.userType = 4;
        break;
      case 'orl':
        this.userType = 46;
        break;
      case 'ostepathMedecin':
        this.userType = 65;
        break;
      case 'medecinTraitH':
        this.userType = 45;
        break;
      case 'patientRecommending':
        this.userType = 1 ;
        break;
    }
  }

  getUsersByType() {
    let users: any[] = [];
    if (this.userType == 4) {this.endLimit = 23000;}
    users = this.globalUsers.slice(this.startLimit, this.endLimit)
      .filter(x => x.per_type == this.userType && x.per_nom !== '');
      console.log('users',users);
    return users;
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.endLimit = this.endLimit + 5000;
      console.log('🚀 ~ file: search.component.ts ~ line 77 ~ SearchComponent ~ setTimeout ~ this.endLimit', this.endLimit);
      this.startLimit = this.endLimit - 5000;
      console.log('🚀 ~ file: search.component.ts ~ line 79 ~ SearchComponent ~ setTimeout ~ this.startLimit ', this.startLimit);


      const users = this.getUsersByType();
      console.log('🚀 ~  ~ setTimeout ~ users', users);
      this.users = this.users.concat(users);
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      /*  if (this.users.length == 1000) {
         event.target.disabled = true;
       } */
    }, 500);
  }

  onSelectUser() {
    const user: any = this.users.find(x => x.id_personne == this.userIdSelected);
    this.modalCtrl.dismiss({ ...user, medicalId: this.medicalId });
  }

  close() {
    this.modalCtrl.dismiss();
  }


  searchCateg(event: any) {
    this.textSearch = event.target.value;
  }

}
