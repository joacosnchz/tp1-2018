import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TrelloService {
    // private endpoint = 'https://api.trello.com/1';
    // private credentials = 'key=7826a7def1803a362b55c90ac66ab5f1&token=397ec8296006a8e06835afdcbe0b3e4e6bacce8848945ac19870599d171a0959';
    // private board = 'CeLcNDVU';

    // private lists = [{id: '5b6b420b6125170fa01f86f0', name: 'To Do'},
    // {id: '5b6b420c4dd9240f4b1e4f3f', name: 'Doing'},
    // {id: '5b6b420d3579f37d55b18226', name: 'Done'}];

    
    private endpoint = 'http://127.0.0.1:3000';
    private board = '5bf5c6885d0cc6268dd12593';
    private credentials = '';
    private headers = null;

    private lists = [{id: '5bf5c6fc5d0cc6268dd12594', name: 'To Do'},
        {id: '5bf5c7015d0cc6268dd12595', name: 'Doing'},
        {id: '5bf5c7065d0cc6268dd12596', name: 'Done'}];

    constructor(private http: HttpClient) {
      if(!this.credentials && !this.headers) {
        
        this.headers = new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem("authorization")
        });
  
        this.credentials = sessionStorage.getItem("token");
      }
    }

    requestAccessToken(username, password) {
      let file = 'development.json';
      if(environment.production) {
        file = 'production.json';
      }

      return new Observable(observer => {
        this.http.get('assets/config/' + file).subscribe((res:any) => {
          sessionStorage.setItem('authorization', res.auth);
          this.headers = new HttpHeaders({
            'Authorization': 'Bearer ' + res.auth
          });
    
          this.http.post(this.endpoint + '/oauth2/token', {
            username: username,
            password: password,
            grant_type: 'password'
          }, {
            headers: this.headers
          }).subscribe((res:any) => {
            sessionStorage.setItem('token', 'accessToken=' + res.accessToken)
            this.credentials = 'accessToken=' + res.accessToken;
            
            observer.next();
          }, err => {
            observer.error(err);
          });
        });
      });
    }

    hasCredentials() {    
      if(this.credentials) {
        return true;
      } else {
        return false;
      }
    }

    getAll() {
        return this.http.get(this.endpoint + '/boards/' + this.board + '/cards?' + this.credentials, {
          headers: this.headers
        });
    }

    getTodo() {        
      return this.http.get(this.endpoint + '/lists/' + this.lists[0].id + '/cards?' + this.credentials, {
        headers: this.headers
      });
    }

    getDoing() {
      return this.http.get(this.endpoint + '/lists/' + this.lists[1].id + '/cards?' + this.credentials, {
        headers: this.headers
      });
    }

    getDone() {
      return this.http.get(this.endpoint + '/lists/' + this.lists[2].id + '/cards?' + this.credentials, {
        headers: this.headers
      });
    }

    getCard(card){
      return this.http.get(this.endpoint + '/cards/' + card.id + '?' + this.credentials, {
        headers: this.headers
      });
    }

    delete(id) {
      return this.http.delete(this.endpoint + '/cards/' + id + '?' + this.credentials, {
        headers: this.headers
      });
    }

    newCard(card){
        return this.http.post(this.endpoint + '/cards?' + this.credentials, {name:  card.name, desc: card.desc, idList: card.idList}, {
          headers: this.headers
        });
    }

    newAttachment(idCard, attachment) {
        let formData:FormData = new FormData();
        formData.append('file', attachment, attachment.name);

        return this.http.post(this.endpoint + '/cards/' + idCard + '/attachments?' + this.credentials, formData, {
          headers: this.headers
        });
    }

    update(card) {
      return this.http.put(this.endpoint + '/cards/' + card.id + '?' + this.credentials, {name: card.name, desc: card.desc, idList: card.idList}, {
        headers: this.headers
      });
    }

    getLists() {
      return this.lists;
    }

    getList(id) {
        for(let i = 0; i < this.lists.length;i++) {
            if(this.lists[i].id == id) {
                return this.lists[i];
            }
        }

        return null;
    }

    getCardAttachments(idCard) {
      return this.http.get(this.endpoint + '/cards/' + idCard + '/attachments?' + this.credentials, {
        headers: this.headers
      });
    }

    deleteAttachment(idCard, idAttachment) {
      return this.http.delete(this.endpoint + '/cards/' + idCard + '/attachments/' + idAttachment + '?' + this.credentials, {
        headers: this.headers
      });
    }
}