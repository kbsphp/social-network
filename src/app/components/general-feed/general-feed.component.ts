import { Component, OnInit,HostListener } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { DatePipe } from '@angular/common';
import * as emoji from 'node-emoji';
import * as io from 'socket.io-client';
import * as CryptoJS from 'crypto-js'; 
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-general-feed',
  templateUrl: './general-feed.component.html',
  styleUrls: ['./general-feed.component.css'],
  providers: [DatePipe],
})
export class GeneralFeedComponent implements OnInit {
  user_id;
  friend;
  selected_user;
  
//  postcomment;
  post_data : any = [];
  disable_postcomment:boolean=false;
  base_url: string = "";
  img_url: string = "";
  socket_url:string= "";
  cmnt_data: any= [];
  cmtId;
  emojiHide:boolean=false;
  edit_comment:boolean =false;
  profile_picture;
  currentUser_picture:string= "";
  showPosts:boolean=false;
  username:string = "";
  fullname:string = "";
  user_data:any =[];
  isPostModal: boolean = false;
  error_msg:string = "";
  sucess_msg:string="";
  isShow="";
  findFriends:boolean=false;
  isSendDisabled:boolean=false;
  isSendReq:boolean=false;
  search_user_data : any = [];
  search_people : string = "";
  search_msg:string= "";
  isSearchUser : boolean = false;
  isDefaultUser : boolean = true;
  post_start:number;
  loading:boolean=false;
   showSlider:boolean=false;
  isDeleteComment:boolean=false;
  private socket;
  photo :string="";
  chunk_Start : any;
  newArray : any = [];
  comntEmoji:boolean=false;
  showScroll: boolean;
  showScrollHeight = 200;
  hideScrollHeight = 10;
  constructor(
    private data_service: DataService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.base_url = environment.base_url;
    this.img_url = environment.img_url;
    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
    
   }

  ngOnInit() {
    //this.user_id = sessionStorage.getItem('user_id');

    setTimeout(()=>{
      this.userDetails();
      this.generalPostAllList();
      this.findFriendList();
    },2000);
   
    this.data_service.currentMessage.subscribe(message => {
      this.post_data.unshift(message);
    })
  }

  @HostListener('window:scroll', [])
    onWindowScroll() 
    {
      if (( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight) 
      {
        this.showScroll = true;
      } 
      else if ( this.showScroll && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight) 
      { 
        this.showScroll = false; 
      }
    }

    scrollToTop() 
    { 
      (function smoothscroll() 
      { var currentScroll = document.documentElement.scrollTop || document.body.scrollTop; 
        if (currentScroll > 0) 
        {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
      })();
    }

  userDetails(){
    this.data_service.GetUserDataByUserId().subscribe(response=>{
      if(response['error'] == false){
      this.username =response['body'][0].username;
      this.fullname= response['body'][0].first_name+ ' '+response['body'][0].last_name;
      this.fullname=this.fullname?this.fullname:this.username;
      this.currentUser_picture=this.img_url+''+response['body'][0].profile_picture;

      }else{
       console.log(response['msg']);
      }
    },error=>{
       console.log("Something went wrong");
    })
   }
 

  generalPostAllList(){
    this.loading=true;
    this.user_id = sessionStorage.getItem('user_id');
   // console.log(this.post_data)
    this.chunk_Start = this.post_data.length == 0 ? 0 : this.post_data[this.post_data.length -1]['id'];
    // console.log(this.chunk_Start)
    const inputJson = {
      "limit": 5,
    	"start": this.chunk_Start == undefined ? 0 : this.chunk_Start,
    	"userID": this.user_id    	
    };
  // console.log(JSON.stringify(inputJson, undefined, 2));
    this.data_service.generalPostData(inputJson).subscribe((response)=>{
     // console.log(JSON.stringify(response, undefined, 2));
        if(response['error']== false){
           this.newArray = this.newArray.concat(response['body']);
           this.showPosts=true;
           this.loading=false;
           this.post_data = this.newArray;

        }else{
          //console.log(this.post_data.length);
          if(this.post_data.length > 1){
            this.showPosts=true;
            this.loading=false;
          }
          else{
            this.showPosts=false;
            this.loading=false;
          }
          console.log(response['msg']) 
        }
      },
      (error)=>{
        this.loading=false;
        this.showPosts=false;
        console.log(error);
      }
    )
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
  
  addEmoji(evt,post){
    if(post.postcomment !=null)
    {
      post.postcomment= post.postcomment+''+evt.emoji.native;
    }else{
      post.postcomment = evt.emoji.native
    }
    this.emojiHide = false;
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

  close_modal() {
    this.error_msg = "";
    this.sucess_msg= "";
    this.isPostModal = false;
    this.isShow="";
  }

  onClickEmoji() {
    this.emojiHide = true;
  }

  post_comment(postID,pvarCommnet,post){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null &&
    sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.disable_postcomment=true;
      this.user_id = sessionStorage.getItem('user_id');
      if(pvarCommnet == "" || pvarCommnet =='undefined' || pvarCommnet.trim() === ''){
        console.log("Please enter comment");
        //this.comment_error="Please enter comment";
        this.disable_postcomment=false;
        return;
      }
      
      const input_data = {
        "userID" : this.user_id,
        "post_id": postID,
        "comment": emoji.unemojify(pvarCommnet)
      }
     // console.log(input_data);
      this.data_service.commentOnPost(input_data).subscribe((response) => {
        if(response['error'] == false){
         // console.log(this.post_data[0]['comments']);
          this.post_data[0]['comments'].push(response['body']);
          post.postcomment='';
        //  console.log(pvarCommnet);
        this.disable_postcomment=false;
        }else{
          console.log(response['msg']);
          this.disable_postcomment=false;
        }
      },error =>{
        this.disable_postcomment=false;
        console.log("Something went wrong");
      });
    }
  }
 

  delete_comment(cmnt){
   // console.log(cmnt)
    let p_user_id = cmnt.user_id;
    let p_cmnt_id = cmnt.id;
    let p_post_id = cmnt.post_id;
    this.isDeleteComment = true;
    this.data_service.deleteComment(p_user_id,p_cmnt_id,p_post_id).subscribe((response) => {
      if(response['error'] == false){
        this.isDeleteComment = false;
        //console.log(this.post_data[0]['comments']);
        this.post_data[0]['comments'].splice(this.post_data[0]['comments'].indexOf(cmnt), 1);
      }else{
        this.isDeleteComment = false;
       
      }
    },error =>{
      this.isDeleteComment = false;
      console.log('Please check the data and try again!');
    });
  }

  cancelComment(pvrId){
    this.cmtId=pvrId;
    this.edit_comment=false;
    this.comntEmoji = false;
  }

  editComment(pvrId,cmt){
    this.edit_comment=true;
    this.cmtId=pvrId;
    cmt.comment=emoji.emojify(cmt.comment);
 }

 commentEmoji(cmtId,cmt){
  this.cmtId=cmtId;
 this.comntEmoji=true;
}

addInComment(evt,cmt){
  if(cmt.comment !=null)
  {
    cmt.comment= cmt.comment+ ''+evt.emoji.native;
  }else{
    cmt.comment = evt.emoji.native
  }
  this.comntEmoji = false;
}

  updateComment(pvrComment){
    if(pvrComment.comment == 'undefined' || pvrComment.comment == null || pvrComment.comment.trim() ==''){
      //console.log("Enter comment to update");
      this.error_msg="Please enter comment to update.";
      this.isShow="modal-backdrop fade show";
      this.isPostModal=true;
      return;
    } 
    this.edit_comment=false;
    let p_user_id = pvrComment.user_id;
    let p_cmnt_id = pvrComment.id;
    let p_post_id = pvrComment.post_id;
    let new_comment=  emoji.unemojify(pvrComment.comment);
   
      this.data_service.updatePostComment(new_comment,p_user_id,p_cmnt_id,p_post_id).subscribe((response)=>
      {
      console.log(response);
      },error=>{
      console.log(error);
      })
  }

  findFriendList(){
    this.user_id = sessionStorage.getItem('user_id');
    //console.log(this.user_id);
    this.socket.emit('getMutualInfo', this.user_id)
    this.socket.on('Getinfo',(response) => {
     // console.log(response);
      if(response != 'undefined' || response !=null )
      {
        this.findFriends=true;
        this.user_data=response;
      }else{
        this.findFriends=false;
      }
      
    })
    return;
    
  }

  sendFriendReq(newfreind){
    const input_data = {"lang":"en","userID": parseInt(this.user_id), "friend_id": parseInt(newfreind)}
    this.isSendDisabled = true;
    this.friend=newfreind;
   // console.log(this.friend);
    this.socket.emit('sendFriendRequest', input_data);
    this.socket.on('sendFriendRequestReturn', (response) =>{
    //  console.log(response);
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

  openUserProfile(pvrId){
    if(this.user_id == pvrId)
    {
      this.router.navigate(['/profile']);
    }else{
      this.selected_user=CryptoJS.AES.encrypt(JSON.stringify(pvrId), 'gurpreet').toString();
      this.router.navigate(['/profile',this.selected_user]);
    }
    
 }

 reportSpamPost(postId,post){
   this.data_service.spamPost(postId).subscribe(response=>{
       if(response['error']==false){
        this.post_data.splice(this.post_data.indexOf(post), 1);
        this.sucess_msg="Post has been blocked.";
        this.isPostModal=true;
        this.isShow="modal-backdrop fade show";
       }else{
         this.error_msg=response['msg'];
         this.isPostModal=true;
         this.isShow="modal-backdrop fade show";
       }
   },error=>{
    this.isPostModal=false;
     console.log(error);
   })
 }

 deletePost(postId,post){
 // console.log(post);
  this.data_service.deletePost(postId).subscribe(response=>{
   if(response['error']==false){
    this.post_data.splice(this.post_data.indexOf(post), 1);
    this.sucess_msg="Post has been deleted";
    this.isPostModal=true;
    this.isShow="modal-backdrop fade show";
   }else{
     this.error_msg=response['msg'];
     this.isPostModal=true;
     this.isShow="modal-backdrop fade show";
   }
  },error=>{
    console.log(error);
  })
 }

 onKeyPressSearch(searchValue: string){
  //console.log(searchValue)
 if(this.search_people != ""){
   this.isDefaultUser = false;
   this.search_user_data = [];
   const input_data = {"userID": parseInt(this.user_id), "search_str": this.search_people}
   this.socket.emit('UsersSearchlist', input_data);
   this.socket.on('GetUsersSearchlist',(response) => {
   //console.log("Search");
    if(response)
    {
      this.isSearchUser = true;
        response.map(item => {
          this.search_user_data=[ {
            name:item.name,
            id:CryptoJS.AES.encrypt(JSON.stringify(item.id), 'gurpreet').toString(),
            profile_picture:item.profile_picture,
            room:item.room
          }
          ]
          
        })
    }else{
         this.search_msg="No Friend Found";
         this.isSearchUser = false;
         this.isDefaultUser = true;  
    }
   },error => {});
 }else{
   this.search_user_data = [];
   this.isSearchUser = false;
   this.isDefaultUser = true;      
 }
}
  

  viewPhoto(PhotoID) {
   // viewPhoto(PhotoID){
    this.showSlider=true;
    this.photo=this.img_url+''+PhotoID;
  //}
  }

  closePhoto() {
    this.showSlider=false;
  }
}
