import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TrelloService } from '../../trello/trello.api';

@Component({
  selector: 'app-newcard',
  templateUrl: './newcard.component.html',
  styleUrls: ['./newcard.component.css']
})
export class NewcardComponent implements OnInit {
  @Input() card;
	@Output() submitClicked = new EventEmitter<any>();
  
	constructor(private api: TrelloService) { 
	}

	ngOnInit() {
		this.initCard();
	}

	initCard() {
		this.card = {
			id: '',
			nombre: '',
			desc: ''
		};
	}

	onClickAceptar(event) {
		this.api.newCard(this.card.nombre, this.card.desc).subscribe(() => {
      console.log('Added');
    });
		this.initCard();
	}
}
