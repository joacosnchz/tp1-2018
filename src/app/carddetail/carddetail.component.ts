import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrelloService }  from '../../trello/trello.api';

@Component({
  selector: 'app-carddetail',
  templateUrl: './carddetail.component.html',
  styleUrls: ['./carddetail.component.css']
})
export class CardDetailComponent implements OnInit {

  @Input() card:any = {};

  constructor(private route: ActivatedRoute, private api : TrelloService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.card.id = params['id'];
      this.api.getCard(this.card).subscribe(card =>{
        this.card = card;
      });
   });
  }

}
