import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrelloService }  from '../../trello/trello.api';

@Component({
  selector: 'app-carddetail',
  templateUrl: './carddetail.component.html',
  styleUrls: ['./carddetail.component.css']
})
export class CardDetailComponent implements OnInit {
    @Input() card:any = {};

    lists;
    mostrarErrorActualizar = false;
    mostrarErrorAdjuntos = false;
    mostrarErrorCrear = false;
    mostrarErrorNuevoAdjunto = false;
    attachments;
    cargando = false;

    constructor(private router : Router, 
                private route: ActivatedRoute, 
                private api : TrelloService) { }

    ngOnInit() {
        this.lists = this.api.getLists();

        this.route.params.subscribe(params => {
            if ( params['id'] ){
                this.loadCardById(params['id']);                
            } else {
                this.initCard();
            }
            
        });
    }

    loadCardById(id){
        this.card.id = id;
        this.api.getCard(this.card).subscribe(card => {
            this.card = card;
            this.loadAttachments();
        });        
    }

    initCard() {
		this.card = {
			id: '',
			name: '',
            desc: '',
            idList: '',
            attachment: null, // Only for adding an attachment
		};
	}

    loadAttachments() {
        this.api.getCardAttachments(this.card.id).subscribe(attachments => {
            this.card.attachments = attachments;
        });
    }

    onClickAceptar(e) {
        this.cargando = true;

        if (this.card.id !== ''){
            this.updateCard(e);
            this.addAttachment(e, this.card);
        } else {
            this.createCard(e);
        }
    }
    
    updateCard(e){
        this.api.update(this.card).subscribe(() => {
            this.router.navigate(['/cards']);
        }, err => {
            console.log(err);
            this.mostrarErrorActualizar = true;
            this.cargando = false;
        }); 
    }

    createCard(e){
        this.api.newCard(this.card).subscribe((createdCard:any) => {
            this.addAttachment(e, createdCard);
            this.router.navigate(['/cards']);
        }, err => { 
            console.log(err);
            this.mostrarErrorCrear = true;
            e.target.innerHTML = 'Aceptar';
            e.target.className = 'btn btn-primary';
            e.target.disabled = false;
        }); 
    }

    fileChange(e) {
        this.card.attachment = e.target.files[0];
    }

    addAttachment(e, card){
        if (this.card.attachment !== null){ 
            
            let previousText = e.target.innerHTML;
            e.target.innerHTML = 'Cargando...';

            this.api.newAttachment(card.id, this.card.attachment).subscribe(() => {
                e.target.innerHTML = previousText;
            }, err => { 
                console.log(err);
                this.mostrarErrorNuevoAdjunto = true;
                this.cargando = false;
                e.target.innerHTML = previousText;
             });
        }
    }

    deleteAttachment(e, idAttachment) {
        e.preventDefault();
        this.cargando = true;

        this.api.deleteAttachment(this.card.id, idAttachment).subscribe(() => {
            this.loadAttachments();
            this.cargando = false;
        }, error => {
            console.log(error);
            this.mostrarErrorAdjuntos = true;
            this.cargando = false;
        });
    }
}
