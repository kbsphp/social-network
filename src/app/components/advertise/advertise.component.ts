import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../shared/data.service'
import { from } from 'rxjs';
import { DatepickerOptions } from 'ng2-datepicker';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.component.html',
  styleUrls: ['./advertise.component.css']
})
export class AdvertiseComponent implements OnInit {
    @ViewChild('file') fileupload: ElementRef;
    file: File;
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
    notMatched:string='';
    base_url : string = "";
    end_date:any; 
    startdate:any;
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
  constructor(private formBuilder:FormBuilder,private data_service:DataService,private _http: HttpClient) {

    this.base_url = environment.base_url;
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
      ad_account_name:['',Validators.required],
      from_date:new Date(),
      to_date:new Date(),
      url : [''],
      account_des:['',Validators.required]
    })
   
   // this.adSetting=this.formBuilder.group({
   //   ad_delivery:[''],
   //   buget_schedule:[''],
   //   actual_amount:[''],
   //   conversion_window:['']
   // })

  //  this.generalSetting.patchValue({
  //     actual_amount:5
  //  })


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

 get ft() { return this.generalSetting.controls; }
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

    //console.log(this.countries)

 })

 }

 // calculate difference between two days
  datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}



  // function is used to set general setting

  fileChange(file){
    this.file = file.target.files[0];
  }

  closepopup(){
    this.notMatched='';
  }

 

  saveGeneralSetting() {
    console.log(this.generalSetting.value);

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
     
     let image = this.file;
     let url = this.generalSetting.value.url;
     let account_des = this.generalSetting.value.account_des;
    // console.log(this.generalSetting.value.from_date.getDate());

      let firstdate = this.generalSetting.value.from_date;
      this.startdate= new Date(firstdate);
      console.log(this.startdate);
     this.end_date = new Date(firstdate.setDate(firstdate.getDate()+6));
     console.log(this.end_date);
     let to_date=this.convert(this.end_date)

     console.log(to_date)
    // var result = Math.round(Math.abs(startdate.getDate() - end_date.getTime()/(1000*60*60*24)));
    //  console.log(result);
//return;
        //let  res = Math.abs(this.generalSetting.value.from_date - this.generalSetting.value.to_date) / 1000;
       //console.log(res/ 86400);
        // let days = Math.floor(res / 86400);
       // console.log("days:"+days);
          let timeDiff = this.end_date - this.startdate;
           let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1
     // console.log(days);
      // return;

         if (days === 7) { 
           ////console.log('yes matches')
          // return;
              var input_data={
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
               "to_date":to_date,
                "product_image" : image,
                "web_url" : url,
                "ad_description":account_des
               }

     console.log(input_data)
     const formData = new FormData();
     formData.append('id', input_data.id);
     formData.append('location', input_data.location);
     formData.append('age', input_data.age);
     formData.append('gender', input_data.gender);
     formData.append('language', input_data.language);
     formData.append('ad_delivery_type', input_data.ad_delivery_type);
     formData.append('buget_schedule', input_data.buget_schedule);
     formData.append('actual_amount', input_data.actual_amount);
     formData.append('conversion_window', input_data.conversion_window);
     formData.append('country', input_data.country);
     formData.append('currency', input_data.currency);
     formData.append('timezone', input_data.timezone);
     formData.append('ad_account_name', input_data.ad_account_name);
     formData.append('from_date', input_data.from_date);
     formData.append('to_date', input_data.to_date);
     formData.append('product_image', input_data.product_image);
     formData.append('web_url', input_data.web_url);
     formData.append('description', input_data.ad_description);


     //console.log(age)
     //let work_experience=this.adForm.value.work_experience
     //let places_you_lived=this.adForm.value.places_you_lived
     //let detail_about_you=this.adForm.value.detail_about_you
     if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){this.token = sessionStorage.getItem('token');}
    const httpOptions = { headers: new HttpHeaders({'authorization': this.token })};
      this._http.post(this.base_url+'socialAdvertisement', formData, httpOptions).subscribe((response) => {
        console.log(response);
        if(response['error'] == false){
          this.genreralSave="Genreal Setting Created Sucessfully";
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
          this.fileupload.nativeElement.value="";
          this.notMatched="";
          
        }else{
          this.notMatched=response['msg'];
        }
      },error =>{
         console.log("Something went wrong!");
      });

 
         } else {
            
            this.notMatched="Please Select 7 days From start date";

         }
        // console.log(days)
    //  return;
    
       
  }

  getUserAboutInfo() {
    this.data_service.getAdUserInfoDetail(this.user_id).subscribe((response) => {
        // console.log(response);
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

 onAdChange(evt){
   let amount;
   if(evt=='click'){
    amount=5;
   }else if(evt=='impression'){
    amount=20;
   }
   else{
    amount='';
   }
  this.generalSetting.patchValue({
    actual_amount:amount
   })
 }

}
