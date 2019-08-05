import { Component,ViewChild, OnInit,ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
declare var $;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [DatePipe]
})
export class ChatComponent implements OnInit {
 @ViewChild('scrollMe') private myScrollContainer: ElementRef;
 @ViewChild("message") inputElement: ElementRef;
  user_id;
  user_name;
  img_url;
 emojiHide;
 msgForm: FormGroup;
 isScroll : boolean = false;
 isTyping: boolean = false;
 selected : any;
 chat_user_id : any;
 new_msg : any = [];
 isSendReq : boolean = false;
 isAcceptReq : boolean = false;
 ballonChat: boolean = false;
 selected_user_id : any;
 isFrndReq: boolean = false;
 new_array = [];
 friend_id: any;
 sel_user_profile_pic : string = "";
 user_data : any = [];
 friendlist:boolean=false;
 isTxtDisabled : boolean = true;
 chat_window:string= "";
 showChat:boolean=false;
 isBtnDisabled : boolean = true;
 chat_with: string = "";
 private socket;
 socket_url: string = "";
 submitted : boolean = false;
 now:number;
 search_people : string = "";
 isSearchUser : boolean = false;
 isDefaultUser : boolean = true;
 search_user_data : any = [];
 minimize_chat:boolean=false;
 showPlus:boolean=false;
  result:any[];
 

  constructor(
    private datePipe: DatePipe,
    private formBuilder:FormBuilder
    ) {
   
    this.socket_url = environment.socket_url;
    this.socket = io.connect(this.socket_url);
    this.img_url=environment.img_url;

    this.msgForm = this.formBuilder.group({
      message: ['', Validators.required],
    });

   }

  ngOnInit() {
    if(sessionStorage.getItem('user_id') != undefined && sessionStorage.getItem('user_id') != null){
      this.user_id = sessionStorage.getItem('user_id');
    }
    if(sessionStorage.getItem('user_name') != undefined && sessionStorage.getItem('user_name') != null){
      this.user_name = sessionStorage.getItem('user_name');
    }

    this.getAllUser();
    this.newMsgWithUser();

    $('#txt_msg').hover(function() {
      $('#close_emoji_btn').trigger('click');
    });
  }

  openchat(){

  this.friendlist= !this.friendlist;
  this.showChat=true;
  this.showPlus=!this.showPlus
    if(this.friendlist)
    {
      this.chat_window="chat-list show";
      this.minimize_chat=true;
      
    }else{
      this.chat_window="chat-list hide";
      this.minimize_chat=false;
      }
  }

  getAllUser(){
    this.socket.on('updateUsers',(response) => {
      this.socket.emit('UserDetail', this.user_id);
      this.socket.on('GetUser',(users) => {
        this.user_data = users;
        console.log('chat user');
        console.log(this.user_data);
      });
    });
  }


  chatUser(item) {
    console.log(item);
    this.emojiHide = true;
    this.sel_user_profile_pic = item.profile_picture
    this.selected = item;
    this.selected_user_id = item.id;
    this.new_msg = [];
    this.new_array = [];
    if(item.status == "0"){
      this.isSendReq = true;
    }else if(item.status == "1"){
      if(item.send_by == this.user_id){
        this.isFrndReq = true;
      }else if(item.send_to == this.user_id){
          this.isAcceptReq = true;
      }
    }else{
      if (!this.ballonChat) {
        this.ballonChat = true;
      }
      this.ballonChat = true;

      this.isTxtDisabled = false;
      this.isBtnDisabled = false;
      this.chat_with = item.name;
      this.socket.emit('join', { to: this.selected_user_id, UserID: this.user_id });
    }
    //this.scrollToBottom();
  }

  closeBallon() {
    this.ballonChat = false;
  }

  newMsgWithUser(){
    this.socket.on('newMessage',(msg) => {
      this.isScroll = false;
      this.isTyping = false;
      this.chat_user_id = -1;
      this.friend_id = -1;
      this.new_array = this.new_array.concat(msg);
      this.new_msg = this.new_array;
      var groups = new Set(this.new_msg.map(item => this.dateFormat(item.sent_time)))
      this.result = [];
      groups.forEach(g => this.result.push({
          date: g,
          values: this.new_msg.filter(i => this.dateFormat(i.sent_time) === g)
        }
      ))
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      console.log('gg');
      console.log(this.result);
    });
  }

  onClickEmoji(){
    this.emojiHide = false;
  }

  closeEmoji(){
    this.emojiHide = true;
  }

  addEmoji(evt){
    let temp;
    if(this.msgForm.value.message == "" || this.msgForm.value.message == undefined || this.msgForm.value.message == null){
      temp = evt.emoji.native
    }else{
      temp = this.msgForm.value.message + ' '+ evt.emoji.native
    }
    this.inputElement.nativeElement.focus();
    this.msgForm.controls['message'].setValue(temp);
    this.emojiHide = true;
  }

  get f() { return this.msgForm.controls; }

  dateFormat(date){
    if(date != null){      
      var d= new Date(date);
      var a = this.datePipe.transform(new Date(d),'dd/MM/yyyy');
      return a;
    }
  }

  timeFormat(date){
    if(date != null){      
      var d= new Date(date);
      var a = this.datePipe.transform(new Date(d),'HH:mm');
      return a;
    }
  }

  textareaEnter(){
    this.sendMessage(this.msgForm.value)
  }

  sendMessage(form) {
    this.submitted = true;
      if (this.msgForm.invalid) {
        return;
    }else{
      const input_data = { to: this.selected_user_id, UserID: this.user_id, msg: form.message }
      this.socket.emit('createMessage', input_data);
      this.msgForm.patchValue({'message': ''});
      this.now = Date.now();
      this.isScroll = false;
    }
  }

  onKeyPress(event: any) {
    let values = event.target.value;
    const input_data = {"userID": parseInt(this.user_id), "friend_id": parseInt(this.selected_user_id)}
    this.socket.emit('userTyping', input_data);
    this.socket.on('userTypingReturn', (response) =>{
      this.friend_id = response['friend_id'];
      this.chat_user_id = response['userID'];
      this.isTyping = true;
    },error => {});
  }

  onKeyUp(e: any){
    this.isTyping = false;
    this.friend_id = this.selected_user_id;
    this.chat_user_id = this.user_id;
  }

  onKeyPressSearch(searchValue: string){
    if(this.search_people != ""){
      this.isSearchUser = true;
      this.isDefaultUser = false;
      this.search_user_data = [];
      const input_data = {"userID": parseInt(this.user_id), "search_str": this.search_people}
      this.socket.emit('UsersSearchlist', input_data);
      this.socket.on('GetUsersSearchlist',(response) =>{
        this.search_user_data = response;
        console.log(this.search_user_data);
      },error => {});
    }else{
      this.search_user_data = [];
      this.isSearchUser = false;
      this.isDefaultUser = true;      
    }
  }

}
