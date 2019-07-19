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
  constructor(private formBuilder:FormBuilder,private data_service:DataService) {

    this.adForm = this.formBuilder.group({
    	name: [''],
    	//email:[''],
    	phone_number:[''],
    	education:[''],
    	work_experience:[''],
    	places_you_lived:[''],
    	detail_about_you:['']
    })

    this.generalSetting=this.formBuilder.group({
    	custom_audience:[''],
    	location:[''],
    	age:[''],
    	gender:[''],
    	language:[''],
    	detail_targeting:['']
    })
   console.log(this.error)
   }

  ngOnInit() {
  }


  saveInformation() {

    let name=this.adForm.value.name;
    let phone_number=this.adForm.value.phone_number;
    let education=this.adForm.value.education;
    let work_experience=this.adForm.value.work_experience
    let places_you_lived=this.adForm.value.places_you_lived
    let detail_about_you=this.adForm.value.detail_about_you

    if ((name.trim() == "" || name.trim() == undefined) && (phone_number.trim() == "" || phone_number.trim()==undefined) && (education.trim() == "" || education.trim()==undefined) && (work_experience.trim() == "" || work_experience.trim() == undefined) && (places_you_lived.trim() == "" || places_you_lived.trim() == undefined) && (detail_about_you.trim() == "" || detail_about_you.trim() == undefined)) {
       console.log('please fill all feilds')
       this.error="please fill all fields"
    } else {
     // console.log(this.adForm.value);
      var input_data = {
      "name": this.adForm.value.name,
      "phone_number":this.adForm.value.phone_number,
      "education": this.adForm.value.education, //(0-text,1-image,2-PDF,3-DOC)
      "work_experience":this.adForm.value.work_experience,
      "places_you_lived":this.adForm.value.places_you_lived,
      "detail_about_you":this.adForm.value.detail_about_you
    }
   if(sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null){
     this.token = sessionStorage.getItem('token');
    }
    this.data_service.saveAdInfo(input_data).subscribe(data => {
         console.log(data)

    })
    }

  }


  // function is used to set general setting

  saveGeneralSetting() {

  
  }

}
