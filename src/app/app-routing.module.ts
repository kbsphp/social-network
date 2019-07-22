import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralFeedComponent } from './components/general-feed/general-feed.component';
import { UserFeedComponent } from './components/user-feed/user-feed.component';
import { PhotosComponent } from './components/photos/photos.component';
import { FindFriendsComponent } from './components/find-friends/find-friends.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { AdvertiseComponent } from './components/advertise/advertise.component'
import { FriendListComponent } from './components/friend-list/friend-list.component';
const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'profile',component:UserFeedComponent},
  {path:'home',component:GeneralFeedComponent},
  {path:'profile/:id', component:ProfileComponent},
  {path:'photos', component:PhotosComponent},
  {path:'find-friends', component:FindFriendsComponent},
  {path:'about',component:AboutComponent},
  {path:'advertise',component:AdvertiseComponent},
  {path:'friend-list',component:FriendListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
