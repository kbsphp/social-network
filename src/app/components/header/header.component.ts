import { Component, OnInit,ElementRef,Renderer2 } from '@angular/core';
import { DataService } from '../../shared/data.service';
//import { ToastrManager } from 'ng6-toastr-notifications';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as CryptoJS from 'crypto-js'; 
import { DatePipe } from '@angular/common';
declare var $;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DatePipe],
})
export class HeaderComponent implements OnInit {
user_id : any = -1;
username;
profile_pic:string="";
img_url;
totalBuyCoin;
token;
notifications:any=[];
chat:boolean=false;
  userData : any
  names:any
  newarray: any[];
  str: string;
  sidebarShow:boolean=false;
  profileMenu:boolean=false;
  displayProfile:boolean=false;
  notifyMenu:boolean=false;
  displayNotification:boolean=false;
  search_user_data : any = [];
   search_people : string = "";
   isSearchUser : boolean = false;
   isDefaultUser : boolean = true;
   socket_url: string = "";
   //error_status: boolean = false;
    private socket;
    isLoggedIn$: Observable<boolean>;  
  constructor(private el: ElementRef, private data_services: DataService,   
   
    private router: Router,
    private datePipe: DatePipe,
    private renderer: Renderer2
    ) {
    this.img_url=environment.img_url;
    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
   //console.log(this.error_status)

      const url = window.location.href;
      if (url.includes('?')) {
        const string = url.split('?')[1];
        const string_0 = string.split('&')[0];
        this.token = string_0.split('=')[1];
        const string_1 = string.split('&')[1];
        this.user_id = string_1.split('=')[1];
      }

     }

  ngOnInit() {
    if(this.token != undefined && this.user_id != undefined){
      sessionStorage.setItem("token", this.token);
      sessionStorage.setItem("user_id", this.user_id);
      localStorage.setItem('isLoggedin', 'true');
     // this.data_services.changeSub.next('change');
      }
    this.userDetails();
    this.getUserAccount();
    this.getNotification();
    this.isLoggedIn$ = this.data_services.isLoggedIn;
     if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
    }
    this.userData=JSON.parse(localStorage.getItem('userData'));
   // this.profile_pic =  this.userData['profile_picture'];
     this.data_services.detectChange().subscribe(()=>{
       if(localStorage.getItem("updated_pic") != undefined){
       this.profile_pic = localStorage.getItem("updated_pic") ;
       }
     })
   
  }
//   get checkLoggedId(): any {
//     return localStorage.getItem('isLoggedin');
// }


userDetails(){
  this.data_services.GetUserDataByUserId().subscribe(response=>{
    if(response['error'] == false){
    this.username =response['body'][0].username;
    sessionStorage.setItem("user_name", this.username);
    sessionStorage.setItem("profile_picture", response['body'][0].profile_picture);
      let userObj = {
        username : response['body'][0].username,
        email : response['body'][0].email,
        id : response['body'][0].id,
        first_name : response['body'][0].first_name,
        last_name : response['body'][0].last_name
      }
      localStorage['userData'] = JSON.stringify(userObj);
    this.profile_pic=response['body'][0].profile_picture;
    }else{
     console.log(response['msg']);
    }
  },error=>{
     console.log("Something went wrong");
  })

 }

 getUserAccount(){
  this.data_services.userAccount().subscribe(response => {
  if(response['error'] == false){ 
  this.totalBuyCoin = response['body']['totalBuyCoin'];
  }else{
     
  }
  },error => {
    console.log(error);
  }); 
  }

  getNotification(){
    //console.log('Nofifications are:');
    this.data_services.getNotification().subscribe(response => {
      if(response['error'] == false){ 
      this.notifications=response['body'];
     // console.log(this.notifications);
      }else{
         
      }
      },error => {
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

  logout(){
    console.log(this.user_id)
    if(this.user_id != -1){
      this.data_services.logOut().subscribe(response => {
        if(response['error'] == false){
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user_id');
          sessionStorage.removeItem('user_name');
          localStorage.removeItem('isLoggedin'); 
          localStorage.removeItem('userData');
          localStorage.removeItem('updated_pic');
          localStorage.clear();
          //this.router.navigate(['/']);
          location.href="http://devapp.uzyth.com/?l=logout";
        }else{
         console.log("Error occurred..");
        }
      },error => {})
    }else{
      localStorage.removeItem('isLoggedin');
      this.router.navigate(['/']);
    }
  }

  openSidebar(){
    this.sidebarShow= !this.sidebarShow;
    if(this.sidebarShow != false){
      this.el.nativeElement.closest('body').className="show_main";
    }else{
      this.el.nativeElement.closest('body').className="hide_main";
    }
    
  }
  

  openProfileMenu(){
    //  this.profileMenu= !this.profileMenu;
    //  if(this.profileMenu)
    //   {
    //     this.displayProfile=true
    //   }else{
    //     this.displayProfile=false;
    //   }
      if($('.profile-drop').hasClass('open-dd2')){
        $('.profile-drop').removeClass('open-dd2');
        $('body').removeClass('title-open');
        $('body').removeClass('profile-open');
        $('.title-drop .title-menu').hide();
        $('.profile-menu').hide();
      }else{
        $('.profile-drop').addClass('open-dd2');
        $('body').removeClass('title-open');
        $('body').addClass('profile-open');
        $('.title-drop .title-menu').hide();
        $('.profile-menu').show();
      }
    }
  
    openNotification(){
      // this.notifyMenu= !this.notifyMenu;
      
      // if(this.notifyMenu)
      //  {
      //    this.displayNotification=true;
      //    this.renderer.addClass(document.body, 'title-open');
      //   // this.el.nativeElement.closest('body').className="title-open";
      //  }else{
      //    this.displayNotification=false;
      //    this.renderer.removeClass(document.body, 'title-open');
      //    //this.el.nativeElement.removeClass('removeClass');
      //  }
  
      if($('.title-drop').hasClass('open-dd')){
        $('.title-drop').removeClass('open-dd');
        $('body').removeClass('profile-open');
        $('body').removeClass('title-open');
        $('.profile-drop .profile-menu').hide();
        $('.title-menu').hide();
      }else{
        $('.title-drop').addClass('open-dd');
        $('body').removeClass('profile-open');
        $('body').addClass('title-open');
        $('.profile-drop .profile-menu').hide();
        $('.title-menu').show();
      }
    }

  openchatToggle(){
   if(!this.chat){return this.chat=true;}
   this.chat=false;
  }

   onKeyPressSearch(searchValue: string){
    if(this.search_people != ""){
      this.isSearchUser = true;
      this.isDefaultUser = false;
      this.search_user_data = [];
      const input_data = {"userID": parseInt(this.user_id), "search_str": this.search_people}
      this.socket.emit('UsersSearchlist', input_data);
      this.socket.on('GetUsersSearchlist',(response) => {
      response.map(item => {
        this.search_user_data=[ {
          name:item.name,
          id:CryptoJS.AES.encrypt(JSON.stringify(item.id), 'gurpreet').toString(),
          profile_picture:item.profile_picture,
          room:item.room
        }
        ]
      })

   // console.log(JSON.stringify(this.search_user_data));
      },error => {});
    }else{
      this.search_user_data = [];
      this.isSearchUser = false;
      this.isDefaultUser = true;      
    }
  }
}
