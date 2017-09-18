import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import {StompService} from 'ng2-stomp-service';

type Token = string | null;

export class Store {
  private constructor() {
  }

  static set accessToken(value: Token) {
    localStorage.access_token = value;
  }

  static get accessToken(): Token {
    return localStorage.access_token;
  }

  static get isAuthenticated(): boolean {
    return localStorage.length > 0;
  }
}

const TOKEN_URL = 'http://localhost:8080/oauth/token';

@Injectable()
export class AuthService {

  constructor(private readonly httpClient: HttpClient, private readonly stomp: StompService, private readonly router: Router) {
  }

  signUp(user: UserModel): Promise<any> {
    const url = 'http://localhost:8080/signup';
    return this.httpClient.post(url, user).toPromise();
  }

  signIn(user: UserModel): Promise<string> {
    const httpParams = new HttpParams()
      .append('grant_type', 'password')
      .append('username', user.username)
      .append('password', user.password);
    return this.httpClient.post(TOKEN_URL, null, {params: httpParams})
      .map(it => it['access_token'])
      .toPromise();
  }

  async signOut() {
    await this.httpClient.delete(TOKEN_URL, { responseType: 'text' }).toPromise();
    localStorage.clear();
    await this.stomp.disconnect();
    await this.router.navigate(['/']);
  }
}
