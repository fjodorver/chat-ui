import {Component} from '@angular/core';
import {AuthService} from './remote/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent {

  private readonly authService: AuthService;

  private readonly router: Router;

  get isAuthorized(): boolean {
    return this.authService.isAuthorized;
  }

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  logout() {
    this.authService.signOut();
  }

  getActive(url: string): string {
    return (this.router.url === url) ? 'active' : '';
  }
}
