import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	
  title = 'social-network';

constructor(){
	
  const url = window.location.href;
  if(url =="http://localhost:4200/"){
    location.href="http://devapp.uzyth.com/#/";
  }else if(url== "http://social-dev.uzyth.com/"){
    location.href="http://devapp.uzyth.com/#/";
  }
  // if (!url.includes('?')) {
  //location.href="http://devapp.uzyth.com/#/";
  // }
  
}
}