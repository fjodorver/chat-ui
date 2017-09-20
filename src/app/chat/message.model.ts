import {UserModel} from '../remote/auth/user.model';

export class MessageModel {
  content: string;
  readonly user?: UserModel;

  constructor(content: string, user?: UserModel) {
    this.content = content;
    this.user = user;
  }
}
