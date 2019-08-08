import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
//import { DataService } from '../shared/data.service';
//import { ToastrManager } from 'ng6-toastr-notifications';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $;
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
import { DataService } from '../../shared/data.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ CookieService ]
})
export class LoginComponent implements OnInit {
  
  Form
  loginData
  password
  remember_me
  constructor(private fb: FormBuilder,public data_service: DataService,private cookieService: CookieService,private route: ActivatedRoute,public router: Router) { 

      if (localStorage.getItem('isLoggedin')) {
        console.log("wwwwwwwwwwwwwwwwwwww")
        this.router.navigate(['home']);

      } 

    
    this.loginData = {}
    this.Form = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
      'password' : [null, Validators.compose([Validators.required])],
      'remember_me' : [true]
    })

    if(localStorage['userLoginData']){
      let loginForm = JSON.parse(localStorage['userLoginData'])
      console.log("uuuuuuuuuuuuuuuuuu", loginForm)
      loginForm.email = CryptoJS.AES.decrypt(loginForm.email, 'mayank').toString(CryptoJS.enc.Utf8);
      loginForm.password = CryptoJS.AES.decrypt(loginForm.password, 'mayank').toString(CryptoJS.enc.Utf8);
      this.Form.controls['email'].setValue(loginForm.email);
      this.Form.controls['password'].setValue(loginForm.password);
    }
   // if(localStorage['myRememberCheck']){
      // console.log('jjjjjjjjjjjjjjjjjjjjj',localStorage['myRememberCheck'])
    //  this.Form.controls['remember_me'].setValue(localStorage['userLoginData']);
   // }

  }

  ngOnInit() {
    
  }

  _rememberMe(){
      // if ($('#myCheck').is(":checked")){
      //   console.log('it is checked')
      //   let temp = {
      //     email : this.Form.value.email,
      //     password : this.Form.value.password,
      //   }
      //   if(localStorage['userLoginData']){
      //     localStorage.removeItem('userLoginData');
      //   }
      //   temp.email = CryptoJS.AES.encrypt(temp.email, 'mayank').toString()
      //   temp.password = CryptoJS.AES.encrypt(temp.password, 'mayank').toString()
      //   localStorage['userLoginData'] = JSON.stringify(temp);
      // }else{
      //   console.log('it is not checked')
      //   if(localStorage['userLoginData']){
      //     localStorage.removeItem('userLoginData');
      //   }
      // }
      // localStorage['myRememberCheck'] = this.Form.value.remember_me
  }

  onLogin(){
      const input_data = {
        "email": this.Form.value.email,
        "password": this.Form.value.password
      }
     // console.log(input_data)
     // this._rememberMe();
      this.data_service.login(input_data).subscribe(response => {
        console.log(response['error'])
        if(response['error'] == false){
         
          sessionStorage.setItem('token',response['body'][0]['token']);
          sessionStorage.setItem('user_id',response['body'][0]['_id']);
          sessionStorage.setItem('user_name',response['body'][0]['username']);
          // this.data_services.changeSub.next('change');
          this.router.navigate(['home']);
          localStorage.setItem('isLoggedin', 'true');
          let userObj = {
            username : response.body[0].username,
            email : response.body[0].email,
            id : response.body[0]._id,
            profile_picture : response.body[0].profile_picture,
            first_name : response.body[0].first_name,
            last_name : response.body[0].last_name
          }
          console.log(userObj)
          localStorage['userData'] = JSON.stringify(userObj);
        }else{
          if(this.cookieService.check('Email')){
            this.cookieService.delete('Email');
            this.cookieService.delete('Password');
          }
         // this.toastr.errorToastr(response['msg']);
          return;
        }
      },error => {
        if(this.cookieService.check('Email')){
          this.cookieService.delete('Email');
          this.cookieService.delete('Password');
        }
       // this.toastr.errorToastr('Please check the data and try again!');
      });
  }


  //  logOut(){
  //   if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
  //   if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){this.user_id = sessionStorage.getItem('user_id');}
  //   const input_data = {'userID': this.user_id }
  //   const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
  //   return this._http.post(this.base_url+'logOut', input_data, httpOptions )
  //   .map((response:Response)=>{const data = response;return data;})
  //   .catch((error:Error) => {console.log(error);return Observable.throw(error);});
  // }

}
