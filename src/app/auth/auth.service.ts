import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

@Injectable()
export class AuthService {

  public get accessToken(): string {
    return localStorage.access_token;
  }

  public set accessToken(value: string) {
    localStorage.access_token = value
  }

  constructor(private readonly httpClient: HttpClient) { }

  signIn(username: string, password: string) {
    new InjectionToken("test")
    const url = 'http://localhost:8080/oauth/token'
    const httpParams = new HttpParams()
      .append('grant_type', 'password')
      .append('username', 'password')
      .append('password', 'password')
    this.httpClient.post(url, null, { params: httpParams })
      .first()
      .map(it => it['access_token'])
      .subscribe(it => this.accessToken = it)
  }
}