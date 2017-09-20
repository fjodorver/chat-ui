import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {UserModel} from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

  private readonly authService: AuthService;

  readonly model = new UserModel(null, '', '');

  isError = false;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async ngOnInit() {
    if (this.authService.isAuthorized) {
      try {
        await this.authService.trySignIn();
      } catch (e) {
        await this.authService.signOut();
      }
    }
  }

  async onSignIn() {
    try {
      await this.authService.signIn(this.model);
    } catch (e) {
      this.isError = true;
    }
  }

  async onSignUp() {
    try {
      await this.authService.signUp(this.model);
    } catch (e) {
      this.isError = true;
    }
  }
}
