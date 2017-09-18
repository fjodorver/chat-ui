import {Component} from '@angular/core';
import {AuthService, Store} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent {

  get isAuthenticated(): boolean {
    return Store.isAuthenticated;
  }

  constructor(private readonly authService: AuthService) {
  }

  signOut() {
    this.authService.signOut();
  }
}
