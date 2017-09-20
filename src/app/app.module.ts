import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {AuthComponent} from './remote/auth/auth.component';

import {MdButtonModule, MdIconModule, MdInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';

import {StompService} from 'ng2-stomp-service';
import {AccessGuardService} from './remote/auth/access-guard.service';
import {AuthService} from './remote/auth/auth.service';
import {RemoteService} from './remote/remote.service';
import {HistoryComponent} from './chat/history/history.component';

const router: Routes = [
  { path: 'history', component: HistoryComponent, canActivate: [AccessGuardService] },
  { path: 'chat', component: ChatComponent, canActivate: [AccessGuardService]  },
  { path: '', component: AuthComponent },
  { path: '**', component: AuthComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ChatComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MdInputModule,
    MdButtonModule,
    MdIconModule,
    RouterModule.forRoot(router)
  ],
  providers: [StompService, AccessGuardService, AuthService, RemoteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
