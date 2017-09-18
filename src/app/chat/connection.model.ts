import {UserModel} from '../auth/user.model';

export enum Status {
  CONNECTED, DISCONNECTED
}

export class ConnectionModel {
  readonly status: Status;
  readonly user: UserModel;
  constructor(status: Status, user: UserModel) {
    this.status = status;
    this.user = user;
  }
}
