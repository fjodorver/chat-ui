import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {MessageModel} from './message.model';
import {StompService} from 'ng2-stomp-service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concat';
import {UserModel} from '../auth/user.model';
import {ConnectionModel} from './connection.model';

@Injectable()
export class ChatService {

  readonly onConnect: Observable<ConnectionModel>;

  readonly onMessage: Observable<MessageModel>;

  readonly onUser: Observable<UserModel>;

  constructor(private readonly http: HttpClient, private readonly stomp: StompService) {
    stomp.configure({
      host: `http://localhost:8080/websocket/?access_token=${localStorage.access_token}`,
      debug: true,
      queue: {
        init: true
      }
    });
    this.onConnect = this.channelObserve(stomp, '/users/receive');
    this.onMessage = this.http.get<MessageModel[]>('http://localhost:8080/api/v1/messages/')
      .flatMap(it => it)
      .concat(this.channelObserve<MessageModel>(this.stomp, '/messages/receive'));
    this.onUser = this.http.get<UserModel[]>('http://localhost:8080/api/v1/users/')
      .flatMap(it => it);
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
