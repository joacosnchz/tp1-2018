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

    onSubmit(e, attachment) {
        e.preventDefault();
        e.target.innerHTML = 'Cargando...';
        e.target.disabled = true;
        e.target.className = 'btn btn-secondary';

        this.api.update(this.card).subscribe(() => {
            this.api.newAttachment(this.card.id, attachment.files[0]).subscribe(() => {
                this.router.navigate(['/cards']);
            }, err => {
                console.log(err);
                this.mostrarErrorNuevoAdjunto = true;
                e.target.innerHTML = 'Aceptar';
                e.target.className = 'btn btn-primary';
                e.target.disabled = false;
            });
        }, error => {
            console.log(error);
            this.mostrarError = true;
            e.target.innerHTML = 'Aceptar';
            e.target.className = 'btn btn-primary';
            e.target.disabled = false;
        });
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
