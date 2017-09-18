import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Store} from './auth.service';

const CREDENTIALS = btoa('client_id:secret');

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = Store.accessToken;
    const authorized = accessToken === null;
    req = req.clone({
      setHeaders: {
        Authorization: (authorized) ? `Bearer ${accessToken}` : `Basic ${CREDENTIALS}`
      }
    });
    return next.handle(req);
  }
}
