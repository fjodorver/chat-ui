import {Component, OnInit} from '@angular/core';
import {ChatService} from './chat.service';
import {MessageModel} from './message.model';
import {Observable} from 'rxjs/Observable';
import {UserModel} from '../remote/auth/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  providers: [ChatService]
})
export class ChatComponent implements OnInit {

  private readonly chatService: ChatService;

  readonly messages: MessageModel[] = [];

  users: Observable<UserModel[]>;

  model = new MessageModel('');

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  onSend() {
    this.chatService.sendMessage(this.model);
    this.model.content = '';
  }

  async ngOnInit() {
    await this.chatService.connect();
    this.users = this.chatService.getUsers();
    this.chatService.onMessage()
      .subscribe(it => this.messages.push(it));
  }
}
