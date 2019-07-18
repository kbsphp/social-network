import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { DataService } from '../../shared/data.service';
import * as CryptoJS from 'crypto-js'; 
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css']
})
export class FindFriendsComponent implements OnInit {
  user_id;
  friend;
  selected_user;
  socket_url: string = "";
  img_url: string = "";
  user_data : any = [];
  request_list:any=[];
  noReqList:boolean=false;
  isSendDisabled:boolean=false;
  isAcceptDisabled:boolean=false;
  isSendReq:boolean=false;
  private socket;
  constructor(private data_service:DataService,private router: Router) {
    this.img_url = environment.img_url;
    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
   }

  ngOnInit() {
    this.getFriendList();
    this.getAllFriendRequests();
    //this.checkUser();
  }


  getFriendList(){
    this.user_id = sessionStorage.getItem('user_id');
    this.socket.emit('getMutualInfo', this.user_id)
    this.socket.on('Getinfo',(response) => {
      if(response != '' || response!=null || response !='undefined'){
        this.user_data=response;
      }else{
        this.user_data=[];
      }
      
    })
    return;
    
  }

  getAllFriendRequests(){
   this.data_service.getFirendRequests(this.user_id).subscribe((response)=>{
     console.log('FriendReq');
   console.log(response);
   if(response['error']==false){
     this.noReqList=false;
    this.request_list=response['body'];
   }else{
    this.noReqList=true;
    console.log(response['msg']);
   }
  },error=>{
    this.noReqList=false;
    console.log(error);
  })

  }


  sendFriendReq(newfreind){
    const input_data = {"lang":"en","userID": parseInt(this.user_id), "friend_id": parseInt(newfreind)}
    this.isSendDisabled = true;
    this.friend=newfreind;
    console.log(this.friend);
    this.socket.emit('sendFriendRequest', input_data);
    this.socket.on('sendFriendRequestReturn', (response) =>{
      console.log(response);
    if(response['error'] == false){
     this.isSendDisabled = false;
     this.isSendReq = true;
    }else{

     this.isSendDisabled = false;
     this.isSendReq = false;
     return;
    }
    },error => {
      this.isSendDisabled = false;
      this.isSendReq = false;
      console.log(error);
       
    });
  }

  removeFriend(friend){
    let element= this.user_data.indexOf(friend);
    if (element > -1) {
      this.user_data.splice(element, 1);
    }
   
  }

  confirmReq(friendId,friend){
    const input_data = {"lang":"en", "userID": parseInt(this.user_id), "friend_id": parseInt(friendId)}
    this.isAcceptDisabled = true;
    this.socket.emit('acceptFriendRequest', input_data);
    this.socket.on('acceptFriendRequestReturn', (response) =>{
    if(response['error'] == false){
    this.isAcceptDisabled = false;
    let element= this.request_list.indexOf(friend);
    this.request_list.splice(element, 1);
    this.noReqList=true;
    }else{
    this.isAcceptDisabled = false;
    return;
    }
    },error => {
      this.isAcceptDisabled = false;
      console.log(error);
    });
   }

   deleteReq(reqId,friend){
     console.log(reqId);
     const input_data = {"userID": parseInt(this.user_id), "friend_id": parseInt(reqId)}
     this.socket.emit('rejectFriendRequest', input_data);
    this.socket.on('rejectFriendRequestReturn', (response) =>{
    console.log(response);
    if(response['error'] == false){
      this.isAcceptDisabled = false;
      let element= this.request_list.indexOf(friend);
      this.request_list.splice(element, 1);
      this.noReqList=true;
      }else{
      this.isAcceptDisabled = false;
      return;
      }
    },error => {
      this.isAcceptDisabled = false;
      console.log(error);
    });
    
    
   }

   openUserProfile(pvrId){
     this.selected_user=CryptoJS.AES.encrypt(JSON.stringify(pvrId), 'gurpreet').toString();
     this.router.navigate(['/profile',this.selected_user]);
  }


}
