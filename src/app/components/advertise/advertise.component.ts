import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../shared/data.service'
import { from } from 'rxjs';
import { DatepickerOptions } from 'ng2-datepicker';
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
     from_date: Date;
     notMatched:string=''
     options: DatepickerOptions = {
  minYear: 1970,
  maxYear: 2020,
  //minDate:new Date(Date.now()),
  displayFormat: 'D-M-YYYY',
  barTitleFormat: 'MMMM YYYY',
  dayNamesFormat: 'dd',
  firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
 // locale: frLocale,
   minDate: new Date(Date.now()), // Minimal selectable date
 // maxDate: new Date(Date.now()),  // Maximal selectable date
  barTitleIfEmpty: 'Click to select a date',
  placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
  addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
  addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
  fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
  useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
};
  constructor(private formBuilder:FormBuilder,private data_service:DataService) {
 this.from_date=new Date;
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
    	detail_targeting:[''],
      ad_delivery:[''],
     buget_schedule:[''],
     actual_amount:[''],
     conversion_window:[''],
      account_country:[''],
      currency:[''],
      timezone:[''],
      ad_account_name:[''],
      from_date:new Date(),
      to_date:new Date()
    })

   
   // this.adSetting=this.formBuilder.group({
   //   ad_delivery:[''],
   //   buget_schedule:[''],
   //   actual_amount:[''],
   //   conversion_window:['']
   // })


   this.generalSetting.patchValue({
     actual_amount:5
   })


   // this.accountSetting=this.formBuilder.group({
   //    account_country:[''],
   //    currency:[''],
   //    timezone:[''],
   //    ad_account_name:['']
   // })

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

    //console.log(this.data_service.getsAllAds())

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
 
 
    convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
      return [ date.getFullYear(), mnth ,day].join("-");
}


 getListOfCountries() {
 
 this.data_service.getCountryList().subscribe((response) => {
    //console.log(response)
    this.countries=response['body'];

    console.log(this.countries)

 })

 }

 // calculate difference between two days
  datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}



  // function is used to set general setting

  saveGeneralSetting() {
    // console.log(this.generalSetting.value);
     
     let location=this.generalSetting.value.location;
     let language=this.generalSetting.value.language;
     let gender=this.generalSetting.value.gender;
     let age=this.generalSetting.value.age1+','+this.generalSetting.value.age2;
     let id=this.user_id
     let ad_delivery=this.generalSetting.value.ad_delivery;
     let buget_schedule=this.generalSetting.value.buget_schedule;
     let actual_amount=this.generalSetting.value.actual_amount;
     let conversion_window=this.generalSetting.value.conversion_window;
     let country=this.generalSetting.value.account_country;
     let currency=this.generalSetting.value.currency;
     let timezone=this.generalSetting.value.timezone;
     let ad_account_name=this.generalSetting.value.ad_account_name;
     let from_date=this.convert(this.generalSetting.value.from_date);
     let to_date=this.convert(this.generalSetting.value.to_date);
     // console.log(from_date)
 
    //console.log(this.datediff(from_date,to_date))

       let  res = Math.abs(this.generalSetting.value.from_date - this.generalSetting.value.to_date) / 1000;
         let days = Math.floor(res / 86400);

         if (days === 7) { 
           ////console.log('yes matches')
          // return;
              var formData={
               "id":id,
               "location":location,
               "age":age,
               "gender":gender,
               "language":language ,
               "ad_delivery_type":ad_delivery,
               "buget_schedule":buget_schedule,
               "actual_amount":actual_amount,
               "conversion_window":conversion_window,
               "country":country,
               "currency":currency,
               "timezone":timezone,
               "ad_account_name":ad_account_name,
               "from_date":from_date,
               "to_date":to_date

               }

     console.log(formData)

     //console.log(age)
     //let work_experience=this.adForm.value.work_experience
     //let places_you_lived=this.adForm.value.places_you_lived
     //let detail_about_you=this.adForm.value.detail_about_you
   this.data_service.saveGeneralAdSetting(formData).subscribe((response) => {
       // console.log(response)
   
     if (response['error'] == false) {
       
         this.genreralSave="Genreal Setting Created Sucessfully"
         this.generalSetting.reset({
             location:'',
             age1:'',
             age2:'',
             gender:'',
             ad_delivery:'',
             buget_schedule:'',
             actual_amount:5,
             conversion_window:'',
             account_country:'',
             currency:'',
             timezone:'',
  
           }) 
    }

   })
         } else {
            
            this.notMatched="Please Select 7 days From start date"

         }
        // console.log(days)
    //  return;
    
       
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
