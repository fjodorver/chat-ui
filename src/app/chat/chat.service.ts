import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MessageModel} from './message.model';
import {StompService} from 'ng2-stomp-service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concat';
import {ConnectionModel} from './connection.model';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class ChatService {

  readonly onConnect: Observable<ConnectionModel>;

  readonly onMessage: Observable<MessageModel>;

  constructor(private readonly authService: AuthService, private readonly stomp: StompService) {
    stomp.configure({
      host: `http://localhost:8080/websocket/?access_token=${this.authService.token}`,
      debug: true,
      queue: {
        init: true
      }
    });
    this.onConnect = this.channelObserve<ConnectionModel>(stomp, '/users/receive');
    this.onMessage = this.channelObserve<MessageModel>(stomp, '/messages/receive');
  }

  async connect() {
    return this.stomp.startConnect();
  }

  sendMessage(content: string) {
    const message = new MessageModel(content, null);
    this.stomp.send('/app/send', message);
  }

  private channelObserve<T>(stomp: StompService, url: string): Observable<T> {
    return Observable.create(emitter => {
      stomp.subscribe(url, model => emitter.next(model));
    });
  }
}
