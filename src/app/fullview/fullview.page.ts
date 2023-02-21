import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fullview',
  templateUrl: './fullview.page.html',
  styleUrls: ['./fullview.page.scss'],
})
export class FullviewPage implements OnInit {

  @Input() pathFile: string;
  display: boolean;
  @ViewChild('myPinch') myPinch;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {

    console.log('this.pathFile', this.pathFile);
    setTimeout(() => {
      this.display = true;
    }, 900);
  }

  async dismiss() {
    const close = 'Modal Removed';
    await this.modalController.dismiss(close);
  }
  zoomIn() {
    this.myPinch.zoomIn();
  }

  zoomOut() {
    this.myPinch.zoomOut();
  }

}
