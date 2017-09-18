import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {AuthComponent} from './auth/auth.component';

import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdListModule, MdMenuModule,
  MdToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './auth/token.interceptor';

import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';

import {StompService} from 'ng2-stomp-service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AccessGuardService} from './auth/access-guard.service';

const router: Routes = [
  { path: 'messages', component: ChatComponent, canActivate: [AccessGuardService] },
  { path: '', component: AuthComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MdInputModule,
    MdButtonModule,
    MdIconModule,
    MdListModule,
    MdCardModule,
    MdToolbarModule,
    MdMenuModule,
    FlexLayoutModule,
    RouterModule.forRoot(router)
  ],
  providers: [StompService, AccessGuardService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
