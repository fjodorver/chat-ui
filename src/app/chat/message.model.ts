import {UserModel} from '../auth/user.model';

export class MessageModel {
  readonly content: string;
  readonly user?: UserModel;

  constructor(content: string, user?: UserModel) {
    this.content = content;
    this.user = user;
  }
}
