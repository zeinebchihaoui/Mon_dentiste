import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const { clinic } = environment;

@Injectable({
    providedIn: 'root'
})


export class CommentsService {


    constructor(private http: HttpClient,
        private storage: StorageService) {
    }

   async addComment(comment: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.post<any>(`${clinic[name].apiUrl}/comments/insertComment`, comment).toPromise();
    }

    async getComments(id: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/comments/${id}`).toPromise();
    }

    async  getAllComments(id: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/allCommentsByPatient/${id}`).toPromise();
    }

    async   deleteComment(comment: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.delete(`${clinic[name].apiUrl}/comments/deleteComment/${comment}`).toPromise();
    }

    async  updateCommentsRead(allIds: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.put(`${clinic[name].apiUrl}/comments/updateComments`, allIds).toPromise();
    }

    async  updateNotificationsRead(id: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/comments/updateNotification/${id}`).toPromise();
    }


}