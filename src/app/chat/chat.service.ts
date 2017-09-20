import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MessageModel} from './message.model';
import {StompService} from 'ng2-stomp-service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concat';
import {AuthService} from '../remote/auth/auth.service';
import {RemoteService} from '../remote/remote.service';
import {UserModel} from '../remote/auth/user.model';

@Injectable()
export class ChatService {

  private readonly remote: RemoteService;

  private readonly stomp: StompService;

  constructor(authService: AuthService, stomp: StompService, remote: RemoteService) {
    stomp.configure({
      host: `http://localhost:8080/websocket/?access_token=${authService.token}`,
      debug: true,
      queue: {
        init: true
      }
    });
    this.stomp = stomp;
    this.remote = remote;
  }

  async connect() {
    return this.stomp.startConnect();
  }

  getUsers(): Observable<UserModel[]> {
    return this.channelObserve<UserModel[]>('/users/receive');
  }

  getMessages(): Observable<MessageModel[]> {
    return this.remote.get<MessageModel[]>('http://localhost:8080/api/v1/messages/');
  }

  onMessage(): Observable<MessageModel> {
    return this.channelObserve<MessageModel>('/messages/receive');
  }

  sendMessage(messageModel: MessageModel) {
    this.stomp.send('/app/send', messageModel);
  }

  private channelObserve<T>(url: string): Observable<T> {
    return Observable.create(emitter => {
      this.stomp.subscribe(url, model => emitter.next(model));
      this.stomp.send('/app/getMessages', {});
    });
  }
}
