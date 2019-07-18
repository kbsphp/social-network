import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js'; 
@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
 private socket;
 socket_url: string = "";
 user_data : any = [];
 user_id: any;
 user_name : any;
 img_url:string="";
  constructor() { 

    //this.web_url = environment.web_url;
    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
    this.img_url=environment.img_url
 
    //console.log(this.socket_url)
  }

  ngOnInit() {
  	  if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
    }
    if(sessionStorage.getItem('user_name') != undefined && sessionStorage.getItem('user_name') != null){
      this.user_name = sessionStorage.getItem('user_name');
    }
    //console.log(this.user_name)
  	this.getAllUser();

  }

   getAllUser(){
    this.socket.on('updateUsers',(response) => {
      this.socket.emit('UserDetail', this.user_id);
      this.socket.on('GetUser',(users) => { //this.user_data = users;console.log(this.user_data);
      	users.map(item => {
         this.user_data=[ {
          name:item.name,
          id:CryptoJS.AES.encrypt(JSON.stringify(item.id), 'gurpreet').toString(),
          profile_picture:item.profile_picture,
          room:item.room
        }
        ]
      })
      });
    });
  }


}
