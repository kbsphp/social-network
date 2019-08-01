import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { environment } from '../../../environments/environment'; 
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
user_id:any
userAboutData:any=[]
workPlace:string=''
city_name:string=''
professional_skills:string=''
school:string='';
message:string='';
model: any={} ;
userData:any;
username:string="";
img_url: string = "";
setStatus:number;
profile_picture;
tab_pane:string="";
overviewSec:boolean=true;
workinfoSec:boolean=false;
checkStatus:boolean=false;
 show_input : boolean = false;
  show_profession:boolean=false;
    show_school:boolean=false;
    show_university:boolean=false;
    show_hometown:boolean=false;
    show_cityname:boolean=false;
    show_otherplaces:boolean=false;
  constructor(private data_service: DataService) {
   //this.base_url = environment.base_url;
    this.img_url = environment.img_url; 
  this.userData=JSON.parse(localStorage.getItem('userData'));
   this.profile_picture = this.img_url + "" + this.userData['profile_picture'];
   this.username=this.userData['username'];
   this.tab_pane="active";
  console.log(this.userData)
  }

  ngOnInit() {
     if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
    }
  // if(localStorage.getItem("updated_pic") != undefined){
  //     this.profile_picture = localStorage.getItem("updated_pic") ;
  //   }
  //   console.log(this.profile_picture)
    //console.log(this.user_id) 
    
    this.setStatus=1;
    this.getInfo()
  }
  
  getInfo() {
 
   this.data_service.getUserAboutInfo(this.user_id).subscribe((response) => {
    //  console.log(response);
      this.model=response['body']; 
      //console.log(this.model); 
      this.userAboutData=response['body'];
     // console.log(this.userAboutData);
      if(this.userAboutData.length==0) {
         this.checkStatus=true;
      }else{
        this.checkStatus=false;
      }
   },error=>{
    console.log(error);
   })


  }
  
  saveAboutOverview(){ 
  //console.log(this.model);
  
   this.data_service.userAboutinfo(this.model).subscribe(data => {     
    console.log(data);          
    },error => {
     // this.toastr.error('Something went wrong!');
    });
    
    
  }
  saveEducationOverview(){
    console.log('called')
    console.log(this.model)
  this.data_service.userAboutinfo(this.model).subscribe(data => {  
    this.setStatus = 1;   
//  console.log(data);          
    },error => {
     // this.toastr.error('Something went wrong!');
    });
  }
  savebasicInfoOverview(){
  //console.log("savebasicInfoOverview");
 // console.log(this.model);
  this.data_service.userAboutinfo(this.model).subscribe(data => {     
  //console.log(data);      
  this.setStatus = 1;    
    },error => {
     // this.toastr.error('Something went wrong!');
    });
  }






 
//getUpdate 

listClick(val) {
  if(val == '1') {
    this.setStatus = 1;
  }else if (val == '2') {
    this.setStatus = 2;
  }else if (val == '3') {
    this.setStatus = 3;
  }
}

showField() {
  this.listClick('2')
  //this.show_input = !this.show_input;
}
changeStatus(){
  console.log(this.show_input)
  //this.show_input=false
}
showFields() {
    this.show_input = !this.show_input;

}

// showProfessional() {
//    this.show_profession=!this.show_profession
// }

// showSchool() {
// this.show_school=!this.show_school
// }
// showUniversity() {
//   this.show_university=!this.show_university
// }

// showHomeTown() {
//  this.show_hometown=!this.show_hometown

// }

// showCityName() {
//   this.show_cityname=!this.show_cityname
// }

// otherPlaces() {
//   this.show_otherplaces=!this.show_otherplaces

// }

}
 
