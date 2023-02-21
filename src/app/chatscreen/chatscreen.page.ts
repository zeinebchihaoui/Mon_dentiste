import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { CommentsService } from '../core/services/comment.service';
import { IonLoaderService } from '../core/services/ion-loader.service';
@Component({
  selector: 'app-chatscreen',
  templateUrl: './chatscreen.page.html',
  styleUrls: ['./chatscreen.page.scss'],
})


export class ChatscreenPage implements OnInit {

  type: number;
  title: string;
  color: string;
  listComments: any = [];
  currentDate = new Date();
  message = {
    comment: '',
    code: '',
    dateCommentaire: '',
    dateDeDebut: '',
    dateDeFin: '',
    idParent: 0,
    idPatient: 0,
    id_Ecrivain: 0,
    importance: 0,
    isread: 0,
    sender: 0,
    typecomment: 0,
  };
  patientId: number;
  constructor(
    public activatedRoute: ActivatedRoute,
    private storage: StorageService,
    private commentsService: CommentsService,
    private ionLoaderService: IonLoaderService,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.type = params.type;
      this.title = params.title;
      this.color = params.color;
    });
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.storage.getObject('patient_info')
      .then(async (patient: any) => {
        console.log('🚀~   ~ patient', patient);
        this.patientId = patient.id_personne;
        await this.getComments(patient.id_personne);
      });
  }

  async getComments(patientId: number) {
    this.ionLoaderService.startLoader();
    this.commentsService.getAllComments(patientId).then((comments: any[]) => {
      this.listComments = comments.filter((x: any) => x.typecomment == this.type);
      console.log('this.listComments', this.listComments);
      this.ionLoaderService.stopLoader();
    },
      (error: Error) => {
        this.ionLoaderService.stopLoader();
        console.log('error', error);

      });
  }



  sendComment() {
    this.message.sender = this.patientId;
    this.message.typecomment = this.type;
    this.ionLoaderService.startLoader();
    this.commentsService.addComment(this.message).then((comment: any) => {
      console.log('comment', comment);
      this.message.comment = '';
      this.getComments(this.patientId);
      this.ionLoaderService.stopLoader();
    },
      (error: Error) => {
        console.log('error', error);
        this.ionLoaderService.stopLoader();
      });
  }

}
