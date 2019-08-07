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
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
user_id : any = -1;
username;
profile_pic:string="";
img_url;
totalBuyCoin;
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
    private renderer: Renderer2
    ) {
    this.img_url=environment.img_url;
    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
   //console.log(this.error_status)

      console.log("header working");

     }

  ngOnInit() {
    console.log('called ngOnit')
    this.userDetails();
    this.getUserAccount();
    this.isLoggedIn$ = this.data_services.isLoggedIn;
     if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
      //console.log(this.user_id)
    }
    if (localStorage['userData']) {
      //console.log("ppppppppppppppppppppppppp")
      this.userData=JSON.parse(localStorage['userData']);
    }
   
  }
  get checkLoggedId(): any {
    return localStorage.getItem('isLoggedin');
}

userDetails(){
  this.data_services.GetUserDataByUserId().subscribe(response=>{
   console.log('Here');
    if(response['error'] == false){
    this.username =response['body'][0].username;
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
    console.log(response);
  if(response['error'] == false){ 
  this.totalBuyCoin = response['body']['totalBuyCoin'];
  console.log(this.totalBuyCoin);
  }else{
     
  }
  },error => {
    console.log(error);
  }); 
  }

  logout(){
    console.log(this.user_id)
    if(this.user_id != -1){
      this.data_services.logOut().subscribe(response => {
        if(response['error'] == false){
          //console.log('herere')
           //this.error_status=true;
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user_id');
          localStorage.removeItem('isLoggedin'); 
          localStorage.removeItem('userData');
          localStorage.removeItem('updated_pic');
         //localStorage.clear();
         //sessionStorage.clear();
          this.router.navigate(['/']);
        }else{
         // this.toastr.errorToastr(response['msg']);
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
   this.profileMenu= !this.profileMenu;
   if(this.profileMenu)
    {
      this.displayProfile=true
    }else{
      this.displayProfile=false;
    }
  }

  openNotification(){
    this.notifyMenu= !this.notifyMenu;
    
    if(this.notifyMenu)
     {
       this.displayNotification=true;
       this.renderer.addClass(document.body, 'title-open');
      // this.el.nativeElement.closest('body').className="title-open";
     }else{
       this.displayNotification=false;
       this.renderer.removeClass(document.body, 'title-open');
       //this.el.nativeElement.removeClass('removeClass');
     }
  }

   onKeyPressSearch(searchValue: string){
     //console.log(searchValue)
    if(this.search_people != ""){
      this.isSearchUser = true;
      this.isDefaultUser = false;
      this.search_user_data = [];
      const input_data = {"userID": parseInt(this.user_id), "search_str": this.search_people}
      this.socket.emit('UsersSearchlist', input_data);
      this.socket.on('GetUsersSearchlist',(response) => {
      console.log(response)
//let other = [];
      response.map(item => {
        this.search_user_data=[ {
          name:item.name,
          id:CryptoJS.AES.encrypt(JSON.stringify(item.id), 'gurpreet').toString(),
          profile_picture:item.profile_picture,
          room:item.room
        }
        ]
      })
       //var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
      //this.search_user_data = response;

      console.log(JSON.stringify(this.search_user_data))
        //console.log(this.search_user_data)
      },error => {});
    }else{
      this.search_user_data = [];
      this.isSearchUser = false;
      this.isDefaultUser = true;      
    }
  }
}
