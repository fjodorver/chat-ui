import {Injectable} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RemoteService {

  private readonly auth: AuthService;

  private readonly http: HttpClient;

  constructor(auth: AuthService, http: HttpClient) {
    this.auth = auth;
    this.http = http;
  }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.headers(),
      params: params
    });
  }

  post<T>(url: string, model?: any, params?: HttpParams): Observable<T> {
    return this.http.post<T>(url, model, {
      headers: this.headers(),
      params: params
    });
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    });
  }
}
