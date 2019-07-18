import { Component, OnInit } from '@angular/core';
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
  userData : any
  names:any
  newarray: any[];
  str: string;
  search_user_data : any = [];
   search_people : string = "";
   isSearchUser : boolean = false;
   isDefaultUser : boolean = true;
   socket_url: string = "";
   //error_status: boolean = false;
    private socket;
    isLoggedIn$: Observable<boolean>;  
  constructor( private data_services: DataService,   
   
    private router: Router,
    ) {

    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
   //console.log(this.error_status)
     }

  ngOnInit() {
    this.isLoggedIn$ = this.data_services.isLoggedIn;
     if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
      //console.log(this.user_id)
    }
    if (localStorage['userData']) {
      console.log("ppppppppppppppppppppppppp")
      this.userData=JSON.parse(localStorage['userData']);
    }
  }
  get checkLoggedId(): any {
    return localStorage.getItem('isLoggedin');
}
  logout(){
    //console.log(this.user_id)
    if(this.user_id != -1){
      this.data_services.logOut().subscribe(response => {
        if(response['error'] == false){
          //console.log('herere')
           //this.error_status=true;
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user_id');
          localStorage.removeItem('isLoggedin'); 
         localStorage.removeItem('userData');
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
