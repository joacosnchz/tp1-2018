import { Component, OnInit } from '@angular/core';
import { TrelloService } from '../../trello/trello.api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username;
  password;
  mostrarError = false;

  constructor(private router : Router, private api : TrelloService) {  }

  ngOnInit() { 
    if(this.api.hasCredentials()) {
      this.router.navigate(['cards']);
    }
  }

  onFormSubmit() {
    this.api.requestAccessToken(this.username, this.password).subscribe(res => {
      this.router.navigate(['cards']);
    }, err => {
      this.mostrarError = true;
    });
  }

}