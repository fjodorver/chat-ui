export class UserModel {
  readonly id: number | null;
  readonly username: string;
  readonly password: string;
  constructor(id: number | null, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}
