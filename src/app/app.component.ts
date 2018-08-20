import { Component } from '@angular/core';
import { TrelloService } from '../trello/trello.api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todoCards;

  constructor(private api: TrelloService) {
    this.todoCards = new Array();
    api.getAll().subscribe((data) => {
      this.todoCards = data;
    });
  }

  onDeleteClick(id) {
    this.api.delete(id).subscribe(() => {
      console.log('Deleted');
    });
  }
}
