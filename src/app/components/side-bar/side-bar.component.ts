import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { environment } from '../../../environments/environment';
declare var $;
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  user_id;
  username;
  fullname;
  user;
  currentUser_picture;
  img_url: string = "";
  active:number;

  constructor(private router: Router,
    private data_service: DataService
    ) {
      this.img_url = environment.img_url;
      this.data_service.detectChange().subscribe(()=>{
        if(localStorage.getItem("updated_pic") != undefined){
          this.currentUser_picture = localStorage.getItem("updated_pic") ;
        }
        })
     }

  ngOnInit() {
    this.userDetails();
    if(sessionStorage.getItem('profile_picture') != undefined){
      this.currentUser_picture=sessionStorage.getItem('profile_picture');
    } 
    if(sessionStorage.getItem('user_name')) {
      this.username=sessionStorage.getItem('user_name');
    }  
  
  }

  userDetails(){
    this.data_service.GetUserDataByUserId().subscribe(response=>{
      if(response['error'] == false){
      this.currentUser_picture=response['body'][0].profile_picture;
     this.user_id = sessionStorage.getItem('user_id');
    this.username =sessionStorage.getItem('user_name');
      }else{
       console.log(response['msg']);
      }
    },error=>{
        console.log("Something went wrong");
    })
 
   }

   hide_overlay(){
    $('body').removeClass('profile-open');
    $('body').removeClass('title-open');
    $('.profile-drop .profile-menu , .title-drop .title-menu').hide();
    $('.black-overlay, .black-overlay2').hide();
    }
 
  }
