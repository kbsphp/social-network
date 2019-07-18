import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from "@angular/router";
import { ActivatedRoute, Router } from '@angular/router';


import * as CryptoJS from 'crypto-js'; 
import { DataService } from '../../shared/data.service';
import { DatePipe } from '@angular/common';
import * as emoji from 'node-emoji';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id:any
  user_id:any
  cover_pic:string= "";
  showPosts:boolean=false;
  profile_post_data : any = [];
  img_url: string = "";
  profile_new_post_data : any = [];
  profile_picture:string = ''
  username:string='';
  userMedia:any=[];
  socket_url: string = "";
  user_status:string ="";
  isSendDisabled:boolean=false;
  isAcceptDisabled:boolean=false;
   private socket;
   user_data : any = [];
  constructor(private activatedRoute:ActivatedRoute,private data_service: DataService,private datePipe: DatePipe, private router:Router) {
   this.img_url = environment.img_url;
  // console.log(this.id)
 //  this.getUserDetail()
    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
   }

  ngOnInit() {
  	this.id=this.activatedRoute.snapshot.paramMap.get('id')
    this.id = CryptoJS.AES.decrypt(this.id, 'gurpreet').toString(CryptoJS.enc.Utf8);
  //	 console.log(this.id)
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   this.getPostDetail();
  this.getFriendList();
  this.userDetails();
  this.getPostMedia();
  this.checkUserStatus();
  if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
    }
  //console.log(this.user_id+'...................'+ this.id)
// this.getUserDetail();
  }

  checkUserStatus(){
     let selected_user=this.id;
     this.user_id = sessionStorage.getItem('user_id');
     this.data_service.checkUserStatus(this.user_id,selected_user).subscribe(response=>{
      console.log(response['body']);
      if(response['body'].Friend == true)
      {
        this.user_status= "Friend";
      }else if(response['body'].Request_sent == true){

        this.user_status= "Request Sent";

      }else if(response['body'].accept_friend == true){

        this.user_status= "Accept Request";

      }else{

        this.user_status= "Not Friend";
      }
     },error=>{
       console.log(error);
     });
     
  }

  userDetails(){
    this.data_service.GetUserById(this.id).subscribe(response=>{
      console.log(response);
      if(response['error'] == false){
      this.cover_pic=response['body'][0].cover_pic;
      this.username =response['body'][0].username;
      this.profile_picture=this.img_url+''+response['body'][0].profile_picture;
      }else{
       console.log(response['msg']);
      }
    },error=>{
       console.log("Something went wrong");
    })
 
   }

   getPostMedia(){
      this.data_service.getPostmedia(this.id).subscribe((response) => {
      if(response['error'] == false){
       this.userMedia=response['body'];
      // console.log(this.userMedia);
      }else{
       console.log(response['msg']);
      }
    },error =>{
      console.log(error);
    });
  }
  
  getPostDetail() {
  //console.log(this.id)
  //this.data_service.friendDetail(this.id).subscribe(response => {
  	//console.log(response)
  //})
    // console.log(this.id)
        this.data_service.postList(this.id).subscribe((response) => {
      if(response['error'] == false){
        this.profile_post_data = this.profile_post_data.concat(response['body']);
        if(this.profile_post_data  != "" && this.profile_post_data != null){
           this.showPosts=true;
          this.profile_new_post_data = this.profile_post_data;
        }else{
          this.showPosts=false;
        }
        console.log(this.profile_new_post_data);
      }else{
       console.log(response['msg']);
      }
    },error =>{
      console.log(error);
    });

  }
  

   toLocalDate(date){
    if(date != null){
      //var d= new Date(this.rectifyFormat(date));
      var d= new Date(date);
      var a = this.datePipe.transform(new Date(d),'dd/MM/yyyy hh:mm a');
      return a;
    }
  }

    convetToEmoji(data){
      let convertData = emoji.emojify(data);
      // console.log(a)
      return convertData;
    }  

    getFriendList(){
    this.socket.on('updateUsers',(response) => {
      this.socket.emit('UserDetail', this.id);
      this.socket.on('GetUser',(users) => { //this.user_data = users;console.log(this.user_data);
      	console.log(users)
      	users.map(item => {
         this.user_data=[ {
          name:item.name,
          user:item.id,
          id:CryptoJS.AES.encrypt(JSON.stringify(item.id), 'gurpreet').toString(),
          profile_picture:item.profile_picture,
          room:item.room
        }
        ]
      })
      
      });
    });
    
  }


  sendFriendReq(){
    console.log(this.user_id);
    const input_data = {"lang":"en","userID": parseInt(this.user_id), "friend_id": parseInt(this.id)}
    this.isSendDisabled = true;
    this.socket.emit('sendFriendRequest', input_data);
    this.socket.on('sendFriendRequestReturn', (response) =>{
      console.log(response);
    if(response['error'] == false){
     this.isSendDisabled = false;
     this.user_status= "Request Sent";
    }else{

     this.isSendDisabled = false;
     return;
    }
    },error => {
      this.isSendDisabled = false;
      console.log(error);
       
    });
  }


  acceptReq(){
    console.log('accept');
    const input_data = {"lang":"en", "userID": parseInt(this.user_id), "friend_id": parseInt(this.id)}
    this.isAcceptDisabled = true;
    this.socket.emit('acceptFriendRequest', input_data);
    this.socket.on('acceptFriendRequestReturn', (response) =>{
    if(response['error'] == false){
    this.isAcceptDisabled = false;
    this.user_status= "Friend";
    }else{
    this.isAcceptDisabled = false;
    return;
    }
    },error => {
      this.isAcceptDisabled = false;
      console.log(error);
    });
   }


}
