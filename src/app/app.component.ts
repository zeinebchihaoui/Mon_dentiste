import { Component } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { Platform, ModalController } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(
    private storage: StorageService,
    private platform: Platform,
    ) {

    this.storage.setObject('clinic', 'bergues');
    this.initializeApp();

  }



  initializeApp() {

    this.platform.ready().then(async () => {
      if (this.platform.is('ios')) {
        await StatusBar.setStyle({
          style: Style.Light
        });
      } else {
        // StatusBar.setBackgroundColor({ color: '#000000' });
      }
    });
  }


}
