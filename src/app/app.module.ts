import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/common/http';
//import { CommonModule,HashLocationStrategy, LocationStrategy } from '@angular/common';
 import { HttpModule } from '@angular/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralFeedComponent } from './components/general-feed/general-feed.component';
import { HeaderComponent } from './components/header/header.component';
import { UserFeedComponent } from './components/user-feed/user-feed.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { DataService } from './shared/data.service';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FriendListComponent } from './components/friend-list/friend-list.component';



import { CreatePostComponent } from './components/create-post/create-post.component';
import { ProfileComponent } from './components/profile/profile.component'
import { DatePipe } from '@angular/common';

import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FindFriendsComponent } from './components/find-friends/find-friends.component';
import { PhotosComponent } from './components/photos/photos.component';
import { ChatComponent } from './components/chat/chat.component';


@NgModule({
  declarations: [
    AppComponent,
    GeneralFeedComponent,
    HeaderComponent,
    UserFeedComponent,
    LoginComponent,
    FriendListComponent,
    CreatePostComponent,
     ProfileComponent,
     FindFriendsComponent,
     PhotosComponent,
     ChatComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    InfiniteScrollModule
  ],


  //providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},DataService,CookieService],

  providers: [DataService,CookieService,DatePipe],
   entryComponents : [HeaderComponent],
  //providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},DataService,CookieService],
  //providers: [DataService,CookieService],

  bootstrap: [AppComponent]
})
export class AppModule { }
