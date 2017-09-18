import {Component, OnInit} from '@angular/core';
import {AuthService, Store} from './auth.service';
import {Router} from '@angular/router';
import {UserModel} from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [AuthService]
})
export class AuthComponent implements OnInit {

  readonly model = new UserModel(null, '', '');

  isError = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
  }

  ngOnInit() {
    if (Store.isAuthenticated) {
      this.router.navigate(['/messages']);
    }
  }

  async onSignIn() {
    try {
      Store.accessToken = await this.authService.signIn(this.model);
      await this.router.navigate(['/messages']);
    } catch (e) {
      this.isError = true;
    }
  }

  async onSignUp() {
    try {
      await this.authService.signUp(this.model);
      Store.accessToken = await this.authService.signIn(this.model);
      await this.router.navigate(['/messages']);
    } catch (e) {
      this.isError = true;
    }
  }
}
