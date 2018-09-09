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
    mostrarError = false;
    mostrarErrorAdjuntos = false;
    mostrarErrorCrear = false;
    mostrarErrorCrearAdjunto = false;

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
        e.preventDefault();
        e.target.innerHTML = 'Cargando...';
        e.target.disabled = true;
        e.target.className = 'btn btn-secondary';

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
            this.mostrarError = true;
            e.target.innerHTML = 'Aceptar';
            e.target.className = 'btn btn-primary';
            e.target.disabled = false;
        });
    }

    createCard(e){
        this.api.newCard(this.card).subscribe((createdCard:any) => {
            this.addAttachment(e, createdCard);
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
                this.router.navigate(['/cards']);
                e.target.innerHTML = previousText;
            }, err => { 
                console.log(err);
                this.mostrarErrorCrearAdjunto = true;
                e.target.innerHTML = previousText;
             });
        }
    }

    deleteAttachment(e, idAttachment) {
        e.preventDefault();
        let previousText = e.target.innerHTML;
        e.target.innerHTML = 'Cargando...';

        this.api.deleteAttachment(this.card.id, idAttachment).subscribe(() => {
            this.loadAttachments();
            e.target.innerHTML = previousText;
        }, error => {
            console.log(error);
            this.mostrarErrorAdjuntos = true;
            e.target.innerHTML = previousText;
        });
    }
}
