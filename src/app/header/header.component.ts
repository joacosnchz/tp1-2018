import { Component, DoCheck } from '@angular/core';
import { TrelloService } from '../../trello/trello.api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements DoCheck {
  hasCredentials;

  constructor(private api : TrelloService) {  }

  ngDoCheck() {
    this.hasCredentials = this.api.hasCredentials();
  }

}
