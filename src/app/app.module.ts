import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TrelloService } from '../trello/trello.api';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NewcardComponent } from './newcard/newcard.component';
import { routing } from './app-routing.module';
import { CardListComponent } from './cardlist/cardlist.component';
import { CardDetailComponent } from './carddetail/carddetail.component';

@NgModule({
  declarations: [
    AppComponent,
    NewcardComponent,
    CardListComponent,
    CardDetailComponent,
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
