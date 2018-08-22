import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TrelloService } from '../trello/trello.api';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NewcardComponent } from './newcard/newcard.component';
import { AppRoutingModule } from './/app-routing.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'newcard', component: NewcardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NewcardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    TrelloService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
