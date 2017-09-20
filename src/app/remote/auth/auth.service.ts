import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import {StompService} from 'ng2-stomp-service';

const CREDENTIALS = btoa('client_id:secret');

@Injectable()
export class AuthService {

  private readonly store = localStorage;

  private readonly http: HttpClient;

  private readonly stomp: StompService;

  private readonly router: Router;

  isAuthorized = false;

  get token(): string {
    return this.store.access_token;
  }

  set token(value: string) {
    this.store.access_token = value;
  }

  constructor(http: HttpClient, stomp: StompService, router: Router) {
    this.http = http;
    this.stomp = stomp;
    this.router = router;
    this.isAuthorized = this.token !== undefined;
  }

  async signUp(user: UserModel) {
    const url = 'http://localhost:8080/signup';
    await this.post(url, user);
    await this.signIn(user);
  }

  async signIn(user: UserModel) {
    const url = 'http://localhost:8080/oauth/token';
    const params = new HttpParams()
      .append('grant_type', 'password')
      .append('username', user.username)
      .append('password', user.password);
    this.token = (await this.post(url, user, params))['access_token'];
    this.isAuthorized = true;
    this.router.navigate(['/chat']);
  }

  async trySignIn() {
    const url = 'http://localhost:8080/api/v1/me';
    await this.get<UserModel>(url);
    this.router.navigate(['/chat']);
  }

  async signOut() {
    const url = `http://localhost:8080/signout`;
    try {
      await this.stomp.disconnect();
      await this.get(url);
    } finally {
      localStorage.clear();
      this.isAuthorized = false;
      this.router.navigate(['/']);
    }
  }

  private get<T>(url: string, params?: HttpParams): Promise<T> {
    return this.http.get<T>(url, {
      headers: this.headers(),
      params: params
    }).toPromise();
  }

  private post<T>(url: string, model?: any, params?: HttpParams): Promise<T> {
    return this.http.post<T>(url, model, {
      headers: this.headers(),
      params: params
    }).toPromise();
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: (this.isAuthorized) ? `Bearer ${this.token}` : `Basic ${CREDENTIALS}`
    });
  }
}
