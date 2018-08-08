import { Component } from '@angular/core';
import { TrelloService } from '../trello/trello.api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private api: TrelloService) {
    
  }

  onDeleteClick(id) {
    this.api.delete(id).subscribe(() => {
      console.log('Deleted');
    });
  }
}
