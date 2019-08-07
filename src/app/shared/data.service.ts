import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class DataService {
headers : any;
  token : any;
  user_id: any = -1;
  base_url: string = "";

 
  public changeSub = new Subject<string>();


  private loggedIn = new BehaviorSubject<boolean>(false); 
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }

  constructor(private _http: HttpClient,private http : Http) { 
    this.base_url = environment.base_url;
  }
  
  public messageSource = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();

  newPostMessageUpdation(message) {
    this.messageSource.next(message);
  }



  detectChange():Observable<any>{
    return this.changeSub.asObservable();
    }


   login(input_data){
    return this.http.post(this.base_url+'login',input_data)
    .map((response:Response)=>{const data = response.json();return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

   logOut(){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){this.user_id = sessionStorage.getItem('user_id');}
    const input_data = {'userID': this.user_id }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.post(this.base_url+'logOut', input_data, httpOptions )
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }


  GetUserDataByUserId(){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');

     // console.log("userID"+this.user_id);
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'user/'+this.user_id, httpOptions )
    .map((response:Response)=>{const data = response;
      return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  userAccount(){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){this.user_id = sessionStorage.getItem('user_id');}
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'userAccount/'+ this.user_id + '/?lang=en', httpOptions )
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {console.log(error);return Observable.throw(error);});
    }

  
  userFeedPost(formData,token) {
    const httpOptions = { 
      headers: new HttpHeaders({'authorization':token })
    };
   return this._http.post(this.base_url+'uploadPost', formData, httpOptions)
   .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  generalPostData(inputJson){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.post(this.base_url+'userGeneralPostList', inputJson,httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
}

  postList(pvarId){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'userpostList/'+pvarId,httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  deletePost(postId){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'deletePost/'+postId,httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  spamPost(postId){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'postAsSpam/'+postId,httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  getPostmedia(pvarId){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'getUsermedia/'+pvarId,httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  getUserProfilesPics(pvrId){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'getAllUserProfilePic/'+pvrId,httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  getUserCoverPics(pvrId){

    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'getAllUserCoverPic/'+pvrId,httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }
  likeOnPost(post_id,pvar_user_id){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'likeOnPost/'+pvar_user_id+"/"+post_id, httpOptions )
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  commentList(post_id){
    return this._http.get(this.base_url+'commentList/'+post_id)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  commentOnPost(input_data){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.post(this.base_url+'commentOnPost', input_data, httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  deleteComment(user_id,cmnt_id,post_id){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'deleteComment/'+user_id+"/"+cmnt_id+"/"+post_id, httpOptions )
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  updatePostComment(comment,user_id,cmnt_id,post_id){
    const input_data = {
      "userID" : user_id,
      "post_id": post_id,
      "comment_id":cmnt_id,
      "comment": comment
    };
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.post(this.base_url+'editcomment', input_data, httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});

  }

   friendDetail(user_id){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'user/'+user_id, httpOptions )
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  GetUserById(pvrId){
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
    this.user_id = pvrId;
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
    return this._http.get(this.base_url+'user/'+this.user_id, httpOptions)
    .map((response:Response)=>{const data = response;
      return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  uploadUserProfilePic(formData){

    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
     const httpOptions = { headers: new HttpHeaders({'authorization': this.token })};
    return this._http.post(this.base_url+'uploadProfilePic', formData, httpOptions);
     
  }

  updateUserCoverPhoto(formData){

    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
     const httpOptions = { headers: new HttpHeaders({'authorization': this.token })};
    return this._http.post(this.base_url+'updateuser', formData, httpOptions);

  }

  checkUserStatus(user,selected_user){
    const input_data = {
      "userID" : user,
      "selected_userID": selected_user
    }
    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
    }
     const httpOptions = { headers: new HttpHeaders({'authorization': this.token })};
    return this._http.post(this.base_url+'check_user_status', input_data, httpOptions)
    .map((response:Response)=>{const data = response;return data;})
    .catch((error:Error) => {return Observable.throw(error);});
  }

  getFirendRequests(pvrId){
      if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
      const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.token })};
      return this._http.get(this.base_url+'getAllFriendRequests/'+pvrId, httpOptions )
      .map((response:Response)=>{const data = response;return data;})
      .catch((error:Error) => {return Observable.throw(error);});
    
  }


  getUserAboutInfo(userId) {
    //console.log(userId)
        if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
        this.token = sessionStorage.getItem('token');
     }
     const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};
     return this._http.get(this.base_url+'getAboutinfo/'+userId, httpOptions);
   }

   userAboutinfo(formData) {
    //console.log(userId)
        if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
       this.token = sessionStorage.getItem('token');
     }
     const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};
     return this._http.post(this.base_url+'userAboutinfo/',formData, httpOptions);
   }

   saveAdInfo(formData) {

    //console.log(formData)
     if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
   }
    const httpOptions = { headers: new HttpHeaders({'authorization': this.token })};
   return this._http.post(this.base_url+'yourInfoAdPref', formData, httpOptions);

 }


 getAdUserInfoDetail(userId) {

   ///console.log(userId)
   if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
   }
   var input_id={
     "userID":userId
   }
   const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};
   return this._http.post(this.base_url+'yourInfoAdPref/', input_id,httpOptions);

 }


 updatePersonalInfoAd(formdata) {
   if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
   }

   const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};
   return this._http.post(this.base_url+'updateyourInfoAdPref/', formdata,httpOptions);

 }


 saveGeneralAdSetting(formdata) {

    if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
   }
   
   const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};
   return this._http.post(this.base_url+'generalSettings/', formdata,httpOptions);

 }

 saveAdSetting(formdata) {
 
 console.log(formdata)
   if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
   }
   const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};

   return this._http.post(this.base_url+'adsSettings/', formdata,httpOptions);

 }


  getCountryList() {
  
  if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
   }

   const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};

   return this._http.get(this.base_url+'countryList/',httpOptions);

  }


  saveAdAccountSettings(formdata) {

  if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
   }
  
   const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json','authorization': this.token })};

   return this._http.post(this.base_url+'accountSettings/',formdata, httpOptions);


  }

}
