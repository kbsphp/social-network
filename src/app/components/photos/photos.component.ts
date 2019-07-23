import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  user_id;
  userMedia:any=[];
  userProfilePics:any=[];
  base_url: string = "";
  img_url: string = "";
  showSlider:boolean=false;
  photo :string="";
  constructor(
    private data_service: DataService
  ) { 
    this.base_url = environment.base_url;
    this.img_url = environment.img_url;
  }

  ngOnInit() {
    this.user_id = sessionStorage.getItem('user_id');
    this.getPostMedia();
    this.getProfilePics();
  }


  getPostMedia(){
    this.data_service.getPostmedia(this.user_id).subscribe((response) => {
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

  getProfilePics(){
    this.data_service.getUserProfilesPics(this.user_id).subscribe((response) => {
      if(response['error'] == false){
       this.userProfilePics=response['body'];
       console.log(this.userMedia);
      }else{
       console.log(response['msg']);
      }
    },error =>{
      console.log(error);
    });
  }


  viewPhoto(PhotoID){
    this.showSlider=true;
    this.photo=this.img_url+''+PhotoID;
  }


  closePhoto(){
    this.showSlider=false;
   
  }

}
