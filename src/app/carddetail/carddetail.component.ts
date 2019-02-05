import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrelloService }  from '../../trello/trello.api';
import { Observable } from 'rxjs/Observable';

declare function hasInternetConnection() : boolean;

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
    mostrarErrorCargar = false;
    mostrarErrorInternet = false;
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
            if(hasInternetConnection()) {
              this.loadCardById(params['id']);  
            } else {
              this.mostrarErrorInternet = true;
            }              
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
        this.api.getCard(this.card).then(card => {
            this.card = card;
            this.loadAttachments();
        }).catch(err => {
          console.log(err);
          this.mostrarErrorCargar = true;
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
        this.api.getCardAttachments(this.card.id).then(attachments => {
            this.card.attachments = attachments;
        });
    }

    onSubmit() {
      if(hasInternetConnection()) {
        this.cargando = true;

        if(this.card.id !== '') {
          this.updateCard();
        } else {
          this.createCard();
        }
      } else {
        this.mostrarErrorInternet = true;
      }
    }
    
    updateCard() {
        this.api.update(this.card).then(() => {
            this.addAttachment(this.card).subscribe(() => {
                this.router.navigate(['/cards']);
            });
        }).catch(err => {
            console.log(err);
            this.mostrarErrorActualizar = true;
            this.cargando = false;
        }); 
    }

    createCard(){
        this.api.newCard(this.card).then((createdCard:any) => {
            this.addAttachment(createdCard).subscribe(() => {
                this.router.navigate(['/cards']);
            });
        }).catch(err => { 
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
                this.api.newAttachment(card.id, this.card.attachment).then(() => {
                    observer.next();
                }).catch(err => { 
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

        this.api.deleteAttachment(this.card.id, idAttachment).then(() => {
            this.loadAttachments();
            this.cargando = false;
        }).catch(error => {
            console.log(error);
            this.mostrarErrorAdjuntos = true;
            this.cargando = false;
        });
    }
}
