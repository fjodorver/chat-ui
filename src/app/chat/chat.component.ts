import {Component} from '@angular/core';
import {ChatService} from './chat.service';
import {NgForm} from '@angular/forms';
import {MessageModel} from './message.model';
import {UserModel} from '../auth/user.model';
import {ConnectionModel, Status} from './connection.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent {

  readonly messages: MessageModel[] = [];

  readonly users: UserModel[] = [];

  constructor(private readonly chatService: ChatService) {
    this.run(chatService);
  }

  onSend(form: NgForm) {
    const message = form.value.message;
    this.chatService.sendMessage(message);
    form.reset();
  }

  private async run(chatService: ChatService) {
    await chatService.connect();
    chatService.onConnect.subscribe(it => this.onConnectionStatus(it));
    chatService.onMessage.subscribe(it => this.messages.push(it));
    chatService.onUser.subscribe(it => this.users.push(it));
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
