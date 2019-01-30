import { Component, OnInit } from '@angular/core';
import { TrelloService }  from '../../trello/trello.api';
import { Router } from '@angular/router';

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
  mostrarError = false;
  mostrarErrorEliminar = false;
  searchText: string = "";

  constructor(private api : TrelloService, private router : Router) { } 
  
  ngOnInit() {
    if(this.api.hasCredentials()) {
      this.todoCards = new Array();
      this.doingCards = new Array();
      this.doneCards = new Array();
      this.getAllCards();
    } else {
      this.router.navigate(['login']);
    }
  }

  updateLists(){
    this.lists = [{name:'To Do',data:this.todoCards}, 
                  {name:'Doing',data:this.doingCards}, 
                  {name:'Done', data:this.doneCards}];
  }

  getAllCards() {
    this.api.getTodo().then((data) => {
      this.todoCards = data;
      this.updateLists();
    }).catch(err => {
        console.log(err);
        this.mostrarError = true;
    });

    this.api.getDoing().then((data) => {
        this.doingCards = data;
        this.updateLists();
    }).catch(err => {
        console.log(err);
        this.mostrarError = true;
    });

    this.api.getDone().then((data) => {
        this.doneCards = data;
        this.updateLists();
    }).catch(err => {
        console.log(err);
        this.mostrarError = true;
    });
  }

  onDeleteClick(e, id) {
    e.preventDefault();

    this.api.delete(id).then(() => {
      this.getAllCards();
    }).catch(err => {
      console.log(err);
      this.mostrarErrorEliminar = true;
    });
  }

}
