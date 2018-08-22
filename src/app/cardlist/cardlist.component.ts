import { Component, OnInit } from '@angular/core';
import { TrelloService }  from '../../trello/trello.api';

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.css']
})
export class CardListComponent implements OnInit {
  todoCards;

  constructor(private api : TrelloService) { 
    this.todoCards = new Array();
    this.getAllCards();
  } 

  getAllCards() {
    this.api.getAll().subscribe((data) => {
      this.todoCards = data;
    });
  }

  ngOnInit() {
  }

  onDeleteClick(e, id) {
    e.preventDefault();

    this.api.delete(id).subscribe(() => {
      this.getAllCards();
    });
  }

}
