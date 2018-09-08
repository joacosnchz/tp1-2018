import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TrelloService } from '../../trello/trello.api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newcard',
  templateUrl: './newcard.component.html',
  styleUrls: ['./newcard.component.css']
})
export class NewcardComponent implements OnInit {
    @Input() card;
    @Output() submitClicked = new EventEmitter<any>();
    lists;
    mostrarErrorCarga = false;
    mostrarErrorAdjunto = false;
    cargando = false;
  
	constructor(private router : Router, private api: TrelloService) { 
        this.lists = api.getLists();
	}

	ngOnInit() {
		this.initCard();
	}

	initCard() {
		this.card = {
			id: '',
			nombre: '',
            desc: '',
            idList: '',
            attachment: null
		};
	}

	onClickAceptar(e, attachment) {
        e.preventDefault();
        this.cargando = true;

		this.api.newCard(this.card).subscribe((createdCard:any) => {
            this.api.newAttachment(createdCard.id, attachment.files[0]).subscribe(() => {
                this.router.navigate(['/cards']);
            }, err => {
                console.log(err);
                this.mostrarErrorAdjunto = true;
                this.cargando = false;
            });
        }, err => {
            console.log(err);
            this.mostrarErrorCarga = true;
            this.cargando = false;
        });
	}
}
