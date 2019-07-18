import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../shared/data.service'
import { from } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as emoji from 'node-emoji';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css'],
  providers: [DatePipe],
  
})
export class UserFeedComponent implements OnInit {
  @ViewChild('file') fileupload: ElementRef;
  user_id;
  post_id;
  token;
  userData;
  profile_picture;
  cover_pic;
  cmtId;
  edit_comment:boolean=false;
  username;
  showPosts:boolean=false;
  file:File;
  show:boolean=false;
  base_url: string = "";
  img_url: string = "";
  post_data : any = [];
  new_post_data : any = [];
  cmnt_data : any = [];
  isComment: boolean = false;
  isPostComment:boolean=false;
  comment: string= "";
  comment_error: string = "";
  isDeleteComment: boolean = false;
  isPostModal: boolean = false;
  error_msg:string = "";
  sucess_msg:string="";
  isShow="";
  media_type;
  userMedia:any=[];

  constructor(private formBuilder:FormBuilder,
    private data_service: DataService,
    private datePipe: DatePipe
    ) {
      
    this.base_url = environment.base_url;
    this.img_url = environment.img_url;
    this.userData=JSON.parse(localStorage.getItem('userData'));
   // this.profile_picture = this.img_url + "" + this.userData['profile_picture'];
    // this.data_service.detectChange().subscribe(()=>{
    //   if(localStorage.getItem("updated_pic") != undefined){
    //   this.profile_picture = localStorage.getItem("updated_pic") ;
    //   }
    // })
   }

  ngOnInit() {
    this.postAllList();
    this.userDetails();
    this. getPostMedia();
    this.data_service.currentMessage.subscribe
    (message => {
      this.new_post_data.unshift(message);
    })
  }

  userDetails(){
   this.data_service.GetUserDataByUserId().subscribe(response=>{
     //console.log(response);
     if(response['error'] == false){
     this.cover_pic=this.img_url+''+response['body'][0].cover_pic;
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
    this.user_id = sessionStorage.getItem('user_id');
    this.data_service.getPostmedia(this.user_id).subscribe((response) => {
      if(response['error'] == false){
       this.userMedia=response['body'];
       console.log(this.userMedia);
      }else{
       console.log(response['msg']);
      }
    },error =>{
      console.log(error);
    });
  }
  close_modal() {
    this.error_msg = "";
    this.sucess_msg= "";
    this.isPostModal = false;
    this.isShow="";
  }

  postAllList(){
    this.user_id = sessionStorage.getItem('user_id');
    this.data_service.postList(this.user_id).subscribe((response) => {
      if(response['error'] == false){
        this.post_data = this.post_data.concat(response['body']);
        if(this.post_data != "" && this.post_data != null){
          this.showPosts=true;
          this.new_post_data = this.post_data;

        }else{
          this.showPosts=false;
        }
      // console.log(this.new_post_data);
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

    coverPhoto(file){
      this.file = file.target.files[0];
      console.log(this.file);
      if(this.file != undefined && this.file != null){
      var strFileName = this.getFileExtension1(this.file.name);
      if(strFileName != 'jpeg' && strFileName != 'png' && strFileName != 'jpg'){
        this.error_msg= "Please select valid profile image.";
         console.log('Please select a valid image type jpg|jpeg|png');
         this.isPostModal=true;
         this.isShow="modal-backdrop fade show";
      return;
      }
      if(this.file.size >2000000 ){
        this.error_msg="Please select cover image size less than 2 MB";
        console.log("Please select image size less than 2 MB");
        this.isPostModal=true;
        this.isShow="modal-backdrop fade show";
        return;
      }

      }else{
      console.log('Please select profile pic ');
      return;
      }

      var input_data = {
        "userID": parseInt(this.user_id),
        "cover_pic": this.file == undefined ? "" : this.file
        }
       // console.log(input_data);
        const formData = new FormData();
        formData.append('userID', this.user_id);
        formData.append('cover_pic', input_data.cover_pic);

        this.data_service.updateUserCoverPhoto(formData).subscribe((response) => {
         // console.log(response);
          if(response['error'] == false){
          this.cover_pic=this.img_url+''+response['body'][0].cover_pic;
          this.fileupload.nativeElement.value="";
          console.log("cover has been changed.");
          }else{
          console.log(response['msg']);
          this.error_msg=response['msg'];
          this.isPostModal=true;
          this.isShow="modal-backdrop fade show";
          }
          },error =>{
            console.log(error);
          });

    }


    fileChange(file) {
      this.file = file.target.files[0];
      if(this.file != undefined && this.file != null){
      var strFileName = this.getFileExtension1(this.file.name);
      if(strFileName != 'jpeg' && strFileName != 'png' && strFileName != 'jpg'){
      this.error_msg="Please select valid profile image.";
      console.log('Please select a valid profile image.');
      this.isPostModal=true;
      this.isShow="modal-backdrop fade show";
      return;
      }
      if(this.file.size >2000000 ){
        this.error_msg="Please select image size below 2 MB";
        console.log("Please select image size less than 2 MB");
        this.isPostModal=true;
        this.isShow="modal-backdrop fade show";
        return;
      }
      }else{
      console.log('Please select profile pic ');
      return;
      }
      var input_data = {
      "userID": parseInt(this.user_id),
      "profilePic": this.file == undefined ? "" : this.file
      }
     // console.log(input_data);
      const formData = new FormData();
      formData.append('userID', this.user_id);
      formData.append('profilePic', input_data.profilePic);
      this.data_service.uploadUserProfilePic(formData).subscribe((response) => {
      //  console.log(response);
        if(response['error'] == false){
        this.profile_picture = this.img_url + "" + response['body'][0].profile_picture;
        localStorage.setItem('updated_pic',this.profile_picture);
        this.data_service.changeSub.next('change');
        this.fileupload.nativeElement.value="";
        console.log("Profile changed.");
        }else{
        console.log(response['msg']);
        this.isPostModal=true;
        this.error_msg=response['msg'];
        this.isShow="modal-backdrop fade show";
        }
        },error =>{
          console.log(error);
        });
      }

      getFileExtension1(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
        }


  addPhoto(evt){
    this.file = evt.target.files[0];
    var strFileName = this.getFileExtension1(this.file.name);
    if(strFileName != 'jpeg' && strFileName != 'png' && strFileName != 'jpg'){
    this.error_msg="Please select valid image type jpg|jpeg|png.";
    console.log('Please select valid profile image.');
    this.isPostModal=true;
    this.isShow="modal-backdrop fade show";
    return;
    }
    // if(this.file.size >2000000 ){
    //   this.error_msg="Please select image size below 2 MB";
    //   console.log("Please select image size below 2 MB");
    //   this.isPostModal=true;
    //   this.isShow="modal-backdrop fade show";
    //   return;
    // }
    if(strFileName == 'jpeg' || strFileName == 'png' || strFileName == 'jpg' || strFileName == 'gif'){
      this.media_type = 1;
    }else{
      this.media_type = 0;
    }
    
    var input_data = {
      "userID": parseInt(this.user_id),
      "post_title": "",
      "post_description":"",
      "post_media_type": this.media_type, 
      "post_media": this.file == undefined ? "" : this.file
    }
    const formData = new FormData();
    formData.append('userID', this.user_id);
    formData.append('post_title', input_data.post_title);
    formData.append('post_description', input_data.post_description);
    formData.append('post_media_type', input_data.post_media_type);
    formData.append('post_media', input_data.post_media);
    
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null &&
    sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.token = sessionStorage.getItem('token');
      this.data_service.userFeedPost(formData,this.token).subscribe(data=>{
        if(data['error'] == false){
          this.UpdatePostData(data['body']);
          this.fileupload.nativeElement.value = "";
          this.sucess_msg= "Photo has been uploaded.";
          this.isPostModal = true;
          this.isShow="modal-backdrop fade show";

          }else{
         //console.log(data['msg']);
         this.error_msg=data['msg'];
         this.isPostModal = true;
         this.isShow="modal-backdrop fade show";
        }
},error=>{
  console.log(error);
   this.error_msg='Something went wrong! Please try after sometime';
   this.isPostModal = true;
   this.isShow="modal-backdrop fade show";
});
   
    }
  
  }

  // change username to first name and last name 

UpdatePostData(data) {
  let tempObj = {
    comment: 0,
    comments: [],
    first_name: this.userData.username,
    id: data.id,
    is_likes: "0",
    is_public: "0",
    last_name: this.userData.username,
    likes: 0,
    post_create_date: data.post_create_date,
    post_description: data.	post_description,
    post_media: data.post_media,
    post_media_type: data.post_media_type,
    post_status: data.post_status,
    post_title: data.post_title,
    post_update_date: data.post_update_date,
    profile_picture: this.userData.profile_picture,
    userID: this.userData.id,
    user_id: this.userData.id,
    username: this.userData.username,
  } 
  this.data_service.newPostMessageUpdation(tempObj);
 
 }

 
 
 
 
  }


 

