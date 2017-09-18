import {Component} from '@angular/core';
import {ChatService} from './chat.service';
import {NgForm} from '@angular/forms';
import {MessageModel} from './message.model';
import {UserModel} from '../auth/user.model';
import {ConnectionModel} from './connection.model';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent {

  private readonly chatService: ChatService;

  messages: MessageModel[] = [];

  users: UserModel[] = [];

  constructor(authService: AuthService, chatService: ChatService) {
    this.chatService = chatService;
    this.run(authService, chatService);
  }

  onSend(form: NgForm) {
    const message = form.value.message;
    this.chatService.sendMessage(message);
    form.reset();
  }

  private async run(authService: AuthService, chatService: ChatService) {
    await chatService.connect();
    this.messages = await authService.get<MessageModel[]>('http://localhost:8080/api/v1/messages/');
    this.users = await authService.get<UserModel[]>('http://localhost:8080/api/v1/users/');
    chatService.onMessage.subscribe(it => this.messages.push(it));
    chatService.onConnect.subscribe(it => this.onConnectionStatus(it));
  }

  private onConnectionStatus(model: ConnectionModel) {
    switch (model.status.toString()) {
      case 'CONNECTED':
        this.users.push(model.user);
        break;
      case 'DISCONNECTED':
        this.users.forEach((user, i) => {
          if (model.user.id === user.id) {
            this.users.splice(i, 1);
          }
        });
        break;
    }
  }
}
