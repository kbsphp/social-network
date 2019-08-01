import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../shared/data.service'
import { from } from 'rxjs';
@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.component.html',
  styleUrls: ['./advertise.component.css']
})
export class AdvertiseComponent implements OnInit {
   
    adForm:FormGroup;
    error:string;
   	token:string;
   	generalSetting:FormGroup;
     adSetting:FormGroup;
     model: any={} ;
     workPlace:string='';
     first_name:string='';
     phone:string='';
     professional_skills:string='';
     user_id:any
     countries:any;
     accountSetting:FormGroup;
     sucessMsg:string=''
     genreralSave:string=''
     adSettingSuccess:string=''
     accountSettingSuccess:string=''
  constructor(private formBuilder:FormBuilder,private data_service:DataService) {

    //this.adForm = this.formBuilder.group({
    	//name: [''],
    	//email:[''],
    	//phone_number:[''],
    	//education:[''],
    	//workplace:[''],
    	//places_you_lived:[''],
    	//detail_about_you:['']
    //})
    this.generalSetting=this.formBuilder.group({
    	custom_audience:[''],
    	location:[''],
    	age1:[''],
      age2:[''],
    	gender:[''],
    	language:[''],
    	detail_targeting:['']
    })

   
   this.adSetting=this.formBuilder.group({
     ad_delivery:[''],
     buget_schedule:[''],
     actual_amount:[''],
     conversion_window:['']
   })


   this.adSetting.patchValue({
     actual_amount:5
   })


   this.accountSetting=this.formBuilder.group({
      account_country:[''],
      currency:[''],
      timezone:[''],
      ad_account_name:['']
   })

     // this.accountSetting.patchValue({
     //   currency:"Uzyth"
     // })
 
   //console.log(this.error)
   }

  ngOnInit() {

    if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
    }
    this.getUserAboutInfo()
    this.getListOfCountries()
  }


  saveInformation() {

   //  let name=this.adForm.value.name;
   //  let phone_number=this.adForm.value.phone_number;
   //  let education=this.adForm.value.education;
   //  let work_experience=this.adForm.value.work_experience
   //  let places_you_lived=this.adForm.value.places_you_lived
   //  let detail_about_you=this.adForm.value.detail_about_you

   //  if ((name.trim() == "" || name.trim() == undefined) && (phone_number.trim() == "" || phone_number.trim()==undefined) && (education.trim() == "" || education.trim()==undefined) && (work_experience.trim() == "" || work_experience.trim() == undefined) && (places_you_lived.trim() == "" || places_you_lived.trim() == undefined) && (detail_about_you.trim() == "" || detail_about_you.trim() == undefined)) {
   //     console.log('please fill all feilds')
   //     this.error="please fill all fields"
   //  } else {
   //   // console.log(this.adForm.value);
   //    var input_data = {
   //    "name": this.adForm.value.name,
   //    "phone_number":this.adForm.value.phone_number,
   //    "education": this.adForm.value.education, //(0-text,1-image,2-PDF,3-DOC)
   //    "work_experience":this.adForm.value.work_experience,
   //    "places_you_lived":this.adForm.value.places_you_lived,
   //    "detail_about_you":this.adForm.value.detail_about_you
   //  }
   // if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
   //   this.token = sessionStorage.getItem('token');
   //  }
   //  this.data_service.saveAdInfo(input_data).subscribe(data => {
   //       console.log(data)

   //  })
   //  }
   //console.log('clicked')
   console.log(this.model)
   this.data_service.updatePersonalInfoAd(this.model).subscribe((response) => {     
    //console.log(data.error); 
     if(response['error'] == false) {
       
      this.sucessMsg="Updated Successfully"

     }
 
    },error => {
     //this.toastr.error('Something went wrong!');
     //console.log('error')

     this.error="something went wrong"
    });

  }
 

 getListOfCountries() {
 
 this.data_service.getCountryList().subscribe((response) => {
    //console.log(response)
    this.countries=response['body'];

    console.log(this.countries)

 })

 }

  // function is used to set general setting

  saveGeneralSetting() {
   // console.log(this.generalSetting.value);
     let location=this.generalSetting.value.location;
     let language=this.generalSetting.value.language;
     let gender=this.generalSetting.value.gender;
     let age=this.generalSetting.value.age1+','+this.generalSetting.value.age2;
     let id=this.user_id

     var formData={
       "id":id,
       "location":location,
       "age":age,
       "gender":gender,
       "language":language       
     }

     console.log(formData)
     //console.log(age)
     //let work_experience=this.adForm.value.work_experience
     //let places_you_lived=this.adForm.value.places_you_lived
     //let detail_about_you=this.adForm.value.detail_about_you
  this.data_service.saveGeneralAdSetting(formData).subscribe((response) => {
      console.log(response)
   
   if (response['error'] == false) {
       
       this.genreralSave="Genreal Setting Created Sucessfully"
   }

  })
       
  }

  getUserAboutInfo() {
    this.data_service.getAdUserInfoDetail(this.user_id).subscribe((response) => {
         console.log(response);
         this.model=response['body'];
         //console.log(this.model)
    }, error=>{
      console.log(error)
    })
  }
 
 saveAdSetting() {

    console.log(this.adSetting.value);
     let ad_delivery=this.adSetting.value.ad_delivery;
     let buget_schedule=this.adSetting.value.buget_schedule;
     let actual_amount=this.adSetting.value.actual_amount;
     let conversion_window=this.adSetting.value.conversion_window;
     let id=this.user_id

     var formData={
       "id":id,
       "ad_delivery":ad_delivery,
       "buget_schedule":buget_schedule,
       "actual_amount":actual_amount,
       "conversion_window":conversion_window       
     }
   //console.log(this.adSetting.value)
   this.data_service.saveAdSetting(formData).subscribe((response) => {
      console.log(response)
      if (response['error'] == false) {
         this.adSettingSuccess="Ad settings Created Successfully";
         //this.adSetting.reset()
      }
   })


 }

 saveAccountSetting() {
   console.log(this.accountSetting.value)
     let country=this.accountSetting.value.account_country;
     let currency=this.accountSetting.value.currency;
     let timezone=this.accountSetting.value.timezone;
     let ad_account_name=this.accountSetting.value.ad_account_name;
     let id=this.user_id;

     var formData={
       "id":id,
       "account_country":country,
       "timezone":timezone,
       "ad_account_name":ad_account_name,
       "currency":currency       
     }

     this.data_service.saveAdAccountSettings(formData).subscribe((response) =>{
        console.log(response)

        if (response['error'] == false) {
            
            this.accountSettingSuccess="Account Setting Created Successfully"
        }
     })

 }

}
