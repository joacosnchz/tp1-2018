import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TrelloService } from '../trello/trello.api';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NewcardComponent } from './newcard/newcard.component';
import { routing } from './app-routing.module';
import { CardListComponent } from './cardlist/cardlist.component';

@NgModule({
  declarations: [
    AppComponent,
    NewcardComponent,
    CardListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  providers: [
    TrelloService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
