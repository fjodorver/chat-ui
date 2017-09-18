import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from './auth.service';

@Injectable()
export class AccessGuardService implements CanActivate {

  constructor() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return Store.isAuthenticated;
  }
}
