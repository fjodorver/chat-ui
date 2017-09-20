import {Component} from '@angular/core';
import {ChatService} from '../chat.service';
import {Observable} from 'rxjs/Observable';
import {MessageModel} from '../message.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  providers: [ChatService]
})
export class HistoryComponent {

  readonly messages: Observable<MessageModel[]>;

  constructor(chatService: ChatService) {
    this.messages = chatService.getMessages();
  }
}
