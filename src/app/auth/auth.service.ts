import {Injectable,} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import {StompService} from 'ng2-stomp-service';

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
  }

  get<T>(url: string): Promise<T> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get<T>(url, {headers: headers}).toPromise();
  }

  post<T>(url: string, body?: any, params?: HttpParams): Promise<T> {
    const credentials = btoa('client_id:secret');
    const headers = new HttpHeaders({
      Authorization: (this.isAuthorized) ? `Bearer ${this.token}` : `Basic ${credentials}`
    });
    return this.http.post<T>(url, body, {params: params, headers: headers}).toPromise();
  }

  async signUp(user: UserModel) {
    const url = 'http://localhost:8080/signup';
    await this.post(url, user);
    await this.signIn(user);
  }

  async signIn(user: UserModel) {
    const params = new HttpParams()
      .append('grant_type', 'password')
      .append('username', user.username)
      .append('password', user.password);
    try {
      this.token = (await this.post('http://localhost:8080/oauth/token', params))['access_token'];
      this.isAuthorized = true;
      this.router.navigate(['/messages']);
    } catch (e) {
      console.log(e);
    }
  }

  async signOut() {
    const url = `http://localhost:8080/oauth/token/${this.token}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    await this.stomp.disconnect();
    await this.http.delete(url, {headers: headers, responseType: 'text'}).toPromise();
    this.token = null;
    this.isAuthorized = false;
    this.router.navigate(['/']);
  }
}
