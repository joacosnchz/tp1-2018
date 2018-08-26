import { Component, OnInit, Input } from '@angular/core';
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

    constructor(private router : Router, private route: ActivatedRoute, private api : TrelloService) { }

    ngOnInit() {
        this.lists = this.api.getLists();

        this.route.params.subscribe(params => {
            this.card.id = params['id'];
            this.api.getCard(this.card).subscribe(card => {
                this.card = card;
            });
        });
    }

    onSubmit(e) {
        e.preventDefault();

        this.api.update(this.card).subscribe(() => {
            this.router.navigate(['/cards']);
        }, error => {
            console.log(error);
            this.mostrarError = true;
            e.target.innerHTML = 'Aceptar';
            e.target.className = 'btn btn-primary';
        });
    }

}
