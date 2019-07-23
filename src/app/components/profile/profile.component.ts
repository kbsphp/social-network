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
  id:any;
  user_id:any;
  post_id;
  name;
  cmtId;
  error_msg:string = "";
  sucess_msg:string="";
  cover_pic:string= "";
  cmnt_data : any = [];
  isShow="";
  isDeleteComment: boolean = false;
  isPostModal: boolean = false;
  edit_comment:boolean=false;
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
  isComment: boolean = false;
  isPostComment:boolean=false;
  comment: string= "";
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
      //console.log(response);
      if(response['error'] == false){
      this.cover_pic=response['body'][0].cover_pic;
      this.username =response['body'][0].username;
      this.name=response['body'][0].first_name+' '+ response['body'][0].last_name
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

  like(pvar_obj,pvar_status){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null &&
    sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      
     this.user_id = sessionStorage.getItem('user_id');
       this.data_service.likeOnPost(pvar_obj['id'],this.user_id).subscribe((response) => {
        if(response['error'] == false){
          pvar_obj['is_likes'] = response['body'][0]['is_likes'];
          pvar_obj['likes'] = response['body'][0]['likes'];
          return pvar_obj;
        }else{
          console.log(response['msg']);
        }
      },error =>{
        console.log("Something went wrong! Please try after some time");
      });
    }
  } 

  comment_box(pvar_id){
    //console.log(pvar_id);
    this.isComment = !this.isComment;
    console.log(this.isComment);
    if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
    }
    this.post_id = pvar_id;
    //this.isComment = true;
    if(this.isComment){
      this.cmnt_data = [];
      this.commentList(pvar_id);
      this.isComment= true;
    }else{
      this.isComment= false;
    }
   // console.log(this.isComment);
  }

  commentList(post_id){
    this.data_service.commentList(post_id).subscribe((response) => {
      if(response['error'] == false){
        this.cmnt_data = response['body'];
   // console.log(this.cmnt_data);
      }else{
        console.log(response['msg']);
      }
    },error =>{
      console.log("Something went wrong! Please try after some time. ")
    });
  }

  //getProfilePic()

  post_comment(){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null &&
    sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
      if(this.comment == "" || this.comment.trim() === ''){
        console.log("Please enter comment");
        //this.comment_error="Please enter comment";
        return;
      }
      const input_data = {
        "userID" : this.user_id,
        "post_id": this.post_id,
        "comment": this.comment
      }
      this.isPostComment = true;
      this.data_service.commentOnPost(input_data).subscribe((response) => {
        console.log(response['body']);
        if(response['error'] == false){
          this.cmnt_data.push(response['body']);
          this.comment = "";
          this.isPostComment = false;
        }else{
          this.isPostComment = false;
         // this.comment_error=response['msg'];
          console.log(response['msg']);
        }
      },error =>{
        this.isPostComment = false;
        console.log("Something went wrong");
      });
    }
  }
  editComment(pvrId){
    this.edit_comment=true;
    this.cmtId=pvrId;
 }
 
 cancelComment(pvrId){
  this.cmtId=pvrId;
  this.edit_comment=false;
}

 updateComment(pvrComment){
  if(pvrComment.comment == 'undefined' || pvrComment.comment == null || pvrComment.comment.trim() ==''){
    console.log("Enter comment to update");
    this.error_msg="Please enter comment to update.";
    this.isShow="modal-backdrop fade show";
    this.isPostModal=true;
    return;
  } 
  this.edit_comment=false;
  let p_user_id = pvrComment.user_id;
  let p_cmnt_id = pvrComment.id;
  let p_post_id = pvrComment.post_id;
  let new_comment= pvrComment.comment;
 
    this.data_service.updatePostComment(new_comment,p_user_id,p_cmnt_id,p_post_id).subscribe((response)=>
    {
    console.log(response);
    },error=>{
    console.log(error);
    })
}


  delete_comment(cmnt){
    let p_user_id = cmnt.user_id;
    let p_cmnt_id = cmnt.id;
    let p_post_id = cmnt.post_id;
    this.isDeleteComment = true;
    this.data_service.deleteComment(p_user_id,p_cmnt_id,p_post_id).subscribe((response) => {
      if(response['error'] == false){
        this.isDeleteComment = false;
        this.cmnt_data.splice(this.cmnt_data.indexOf(cmnt), 1);
      }else{
        this.isDeleteComment = false;
       
      }
    },error =>{
      this.isDeleteComment = false;
      console.log('Please check the data and try again!');
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


   close_modal() {
    this.error_msg = "";
    this.sucess_msg= "";
    this.isPostModal = false;
    this.isShow="";
  }


}
