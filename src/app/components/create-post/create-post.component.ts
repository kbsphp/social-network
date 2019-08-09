import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../shared/data.service'
import { from } from 'rxjs';
import * as emoji from 'node-emoji';
import { environment } from '../../../environments/environment';
declare var $;

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @ViewChild('file') fileupload: ElementRef;
  base_url: string = "";
  img_url: string = "";
  user_id:any;
  profile_picture;
  selectedImage : any;
  attachmentName : any = null
  media_type:any;
  file: File;
  token : any;
  msgError:boolean=false
  emojiHide : boolean = false;
  isPostDisabled : boolean = false;
  IsmodelShow:boolean =false;
  postForm: FormGroup;
  userData:any;
  error:string
  isPostModal : boolean = false;
  error_msg : boolean = false;
  btnshare:boolean = false;
  openModal:boolean=false;
  isCLicked:string="";
  constructor(private formBuilder:FormBuilder,private data_service: DataService) { 
    this.postForm = this.formBuilder.group({
      description: [''],
      file: ['']
    });

    this.base_url = environment.base_url;
    this.img_url = environment.img_url;
    this.userData=JSON.parse(localStorage.getItem('userData'));
    // this.profile_picture =  this.userData['profile_picture'];
    this.data_service.detectChange().subscribe(()=>{
    if(localStorage.getItem("updated_pic") != undefined){
      this.profile_picture = localStorage.getItem("updated_pic") ;
    }
    })
  }

  ngOnInit() {

    this.userDetails();
    // this.profile_picture = this.userData['profile_picture'];
  }


  userDetails(){
    this.data_service.GetUserDataByUserId().subscribe(response=>{
    console.log(response);
      if(response['error'] == false){
          this.profile_picture=response['body'][0].profile_picture;
        
      }else{
       console.log(response['msg']);
      }
    },error=>{
       console.log("Something went wrong");
    })
 
   }


  addEmoji(evt){
    let temp 
    if(this.postForm.value.description != null){
      temp= this.postForm.value.description +''+ evt.emoji.native
    }else{
      temp = evt.emoji.native
    }
    this.postForm.controls['description'].setValue(temp);
    //this.emojiHide=false
  }

 
  onClickEmoji() {
    this.emojiHide = true;
  }

 
  close_modal() {
    this.error_msg = false;
    this.error= '';
    this.msgError=false;
   // console.log(this.file);
    //this.postForm.reset();
    this.attachmentName='';
    this.isPostModal = false;
   /// this.fileReset()
    this.isCLicked="";
     this.openModal=false
     this.emojiHide = false;
  }
     
  openPopupModalShow() {

    this.openModal=true


  }


fileReset() {
  this.postForm.reset();
  console.log(this.fileupload.nativeElement.files);
  this.fileupload.nativeElement.value=null
}
  open_modal(){
    this.error_msg = false;
 //  this.isPostModal = true;
   this.btnshare=false;
   this.isCLicked="modal-backdrop fade show";
  }

  savePost(type) {

    this.btnshare=true;
     let desc= this.postForm.value.description;
      //console.log(this.postForm.value)
    let filename=this.postForm.value.file
     if ((desc != '' && desc != null && desc.trim() != '') || filename != '') {
     let UpdatedEmoji = emoji.unemojify(desc);
     this.postForm.controls['description'].setValue(UpdatedEmoji);
      let description=  this.postForm.value.description;
      if((description.trim() == "" || description.trim() == undefined) && (filename == undefined || filename == "")){
        this.error_msg = false;
        console.log('please write or select file');
        this.error='please write text or select file'
        this.btnshare=false;
        return;
      }
     // console.log(this.file);
      if(this.file != undefined && this.file != null ){
       // console.log(this.file)
        var strFileName = this.getFileExtension1(this.file.name);
        if(strFileName != 'jpeg' && strFileName != 'png' && strFileName != 'jpg' && strFileName != 'gif'){
          console.log('Please select a file with correct extension .jpg|.png|.jpeg|.gif');
        this.error_msg = true;
      this.error='Please select a valid file type .jpg|.png|.jpeg|.gif'
      this.postForm.value.file="";
         return;

        }
        if(strFileName == 'jpeg' || strFileName == 'png' || strFileName == 'jpg' || strFileName == 'gif'){
          this.media_type = 1;
        }else{
          this.media_type = 0;
        }
      }
  //console.log(this.file)
     this.user_id = sessionStorage.getItem('user_id');
     this.media_type=0;
     var input_data = {
      "userID": parseInt(this.user_id),
      "post_title": "",
      "post_description":description,
      "post_media_type": this.media_type, //(0-text,1-image,2-PDF,3-DOC)
      "post_media": this.file == undefined ? "" : this.file
    }
    const formData = new FormData();
    formData.append('userID', this.user_id);
    formData.append('post_title', input_data.post_title);
    formData.append('post_description', input_data.post_description);
    formData.append('post_media_type', input_data.post_media_type);
    formData.append('post_media', input_data.post_media);
   if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
    }
    this.data_service.userFeedPost(formData,this.token).subscribe(data=>{
            console.log(data);
            if(data['error'] == false){
              this.postForm.reset();
              this.file = null;
             // console.log(data['msg']);
            
              this.UpdatePostData(data['body']);
              this.fileupload.nativeElement.value = "";
              this.msgError=false;
              this.attachmentName='';
              this.isPostModal = false;
              this.btnshare=false;
              this.isCLicked= "";
              this.emojiHide=false
              this.openModal=false
              this.error_msg=false;
            }else{
             //console.log(data['msg']);
             this.error_msg = true;
             this.error=data['msg'];
            }
    },error=>{
      console.log(error);
      this.error_msg = true;
      this.error='Something went wrong! Please try after sometime';
    });
  } else {
    this.msgError=true

   }
} 


getFileExtension1(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

onPostChange(){
  this.btnshare=false;
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

fileChange(file) {
  this.btnshare=false;
  if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null &&
    sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
    this.file = file.target.files[0];
    //console.log(this.file)
    this.attachmentName = this.file.name

    const fr = new FileReader();
    fr.onloadend = (loadEvent) => {
      let mainImage = fr.result;
      this.selectedImage=mainImage;
    };
    fr.readAsDataURL(this.file);
  }
}

}
