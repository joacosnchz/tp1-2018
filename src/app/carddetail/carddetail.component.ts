import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrelloService }  from '../../trello/trello.api';
import { Observable } from 'rxjs/Observable';

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
      if(this.api.hasCredentials()) {
        this.lists = this.api.getLists();

        this.route.params.subscribe(params => {
          if ( params['id'] ){
            this.loadCardById(params['id']);                
          } else {
            this.initCard();
          }
            
        });
      } else {
        this.router.navigate(['login']);
      }
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

    onSubmit() {
        this.cargando = true;

        if (this.card.id !== ''){
            this.updateCard();
        } else {
            this.createCard();
        }
    }
    
    updateCard() {
        this.api.update(this.card).subscribe(() => {
            this.addAttachment(this.card).subscribe(() => {
                this.router.navigate(['/cards']);
            });
        }, err => {
            console.log(err);
            this.mostrarErrorActualizar = true;
            this.cargando = false;
        }); 
    }

    createCard(){
        this.api.newCard(this.card).subscribe((createdCard:any) => {
            this.addAttachment(createdCard).subscribe(() => {
                this.router.navigate(['/cards']);
            });
        }, err => { 
            console.log(err);
            this.mostrarErrorCrear = true;
            this.cargando = false;
        });
    }

    fileChange(attachment) {
        this.card.attachment = attachment.files[0];
    }

    addAttachment(card) {
        let obs = new Observable(observer => {
            if (this.card.attachment){ 
                this.api.newAttachment(card.id, this.card.attachment).subscribe(() => {
                    observer.next();
                }, err => { 
                    console.log(err);
                    this.mostrarErrorNuevoAdjunto = true;
                    this.cargando = false;
                });
            } else {
                observer.next();
            }
        });

        return obs;
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
