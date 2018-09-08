import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
    mostrarErrorNuevoAdjunto = false;
    attachments;
    cargando = false;

    constructor(private router : Router, private route: ActivatedRoute, private api : TrelloService) { }

    ngOnInit() {
        this.lists = this.api.getLists();

        this.route.params.subscribe(params => {
            this.card.id = params['id'];
            this.api.getCard(this.card).subscribe(card => {
                this.card = card;
            });

            this.loadAttachments();
        });
    }

    loadAttachments() {
        this.api.getCardAttachments(this.card.id).subscribe(attachments => {
            this.attachments = attachments;
        });
    }

    onSubmit(attachment) {
        this.cargando = true;

        this.api.update(this.card).subscribe(() => {
            if(attachment.files[0]) {
                this.api.newAttachment(this.card.id, attachment.files[0]).subscribe(() => {
                    this.router.navigate(['/cards']);
                }, err => {
                    console.log(err);
                    this.mostrarErrorNuevoAdjunto = true;
                    this.cargando = false;
                });
            } else {
                this.router.navigate(['/cards']);
            }
        }, error => {
            console.log(error);
            this.mostrarError = true;
            this.cargando = false;
        }); 
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
