import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-call-clinical',
  templateUrl: './call-clinical.page.html',
  styleUrls: ['./call-clinical.page.scss'],
})
export class CallClinicalPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private callNumber: CallNumber

  ) { }

  ngOnInit() {
  }


  dismiss() {
    this.modalController.dismiss();
  }

  callJoint() {
    this.callNumber.callNumber('123456789',true);
  }


}
