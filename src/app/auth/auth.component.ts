import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {UserModel} from './user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

  readonly model = new UserModel(null, '', '');

  isError = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
  }

  ngOnInit() {
    if (this.authService.isAuthorized) {
      this.router.navigate(['/messages']);
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
