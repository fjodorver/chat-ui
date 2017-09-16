import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

const CREDENTIALS = btoa('client_id:secret');

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private accessToken: string = localStorage.access_token
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authorized = this.accessToken === undefined;
        req = req.clone({
            setHeaders: {
              Authorization: (authorized) ? `Basic ${CREDENTIALS}` : `Bearer ${this.accessToken}`
            }
          });
        return next.handle(req);
    }
}