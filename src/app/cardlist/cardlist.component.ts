import { Component, OnInit } from '@angular/core';
import { TrelloService }  from '../../trello/trello.api';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.css']
})

export class CardListComponent implements OnInit {
  lists;
  todoCards;
  doingCards;
  doneCards;

  constructor(private api : TrelloService) { 
    this.todoCards = new Array();
    this.doingCards = new Array();
    this.doneCards = new Array();
    this.getAllCards();
  } 

  updateLists(){
    this.lists = [{name:'To Do',data:this.todoCards}, 
                  {name:'Doing',data:this.doingCards}, 
                  {name:'Done', data:this.doneCards}];
  }

  getAllCards() {
    this.api.getTodo().subscribe((data) => {
      this.todoCards = data;
      this.updateLists();
    });

    this.api.getDoing().subscribe((data) => {
        this.doingCards = data;
        this.updateLists();
    });

    this.api.getDone().subscribe((data) => {
        this.doneCards = data;
        this.updateLists();
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
