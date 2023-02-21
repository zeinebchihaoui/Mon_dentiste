import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  constructor(
    private route: Router,
  ) { }

  ngOnInit() {

  }

  chatscreen(type: number, title: string, color: string) {
    this.route.navigate(['/chatscreen'],
      {
        queryParams: { type, title, color }
        /* {
          type: type,
          title: title,
          color: color,
        } */
      });
  }






}
