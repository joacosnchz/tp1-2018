import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrelloService } from '../../trello/trello.api';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router : Router, private api : TrelloService) { }

  ngOnInit() {
    this.api.logout();
    this.router.navigate(['login']);
  }

}
