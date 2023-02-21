import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})


export class IonLoaderService {

    constructor(public loadingController: LoadingController) {
    }

    // Simple loader
    startLoader() {
        this.loadingController.create({
            spinner: 'circles'
        }).then((response) => {
            response.present();
        });
    }

    // Dismiss loader
    stopLoader() {
        this.loadingController.dismiss().then((response) => {
            console.log('Loader closed!', response);
        }).catch((err) => {
            console.log('Error occured : ', err);
        });
    }


}
