import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs/Observable';
import { r, P } from '@angular/core/src/render3';

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
    private refreshing = false;

    private lists = [{id: '5bf5c6fc5d0cc6268dd12594', name: 'To Do'},
        {id: '5bf5c7015d0cc6268dd12595', name: 'Doing'},
        {id: '5bf5c7065d0cc6268dd12596', name: 'Done'}];

    constructor(private http: HttpClient) {
      if(!this.credentials && !this.headers) {
        
        this.headers = new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem("authorization")
        });
  
        this.credentials = 'accessToken=' + sessionStorage.getItem("token");
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
          }).subscribe(res => {
            this.updateUserCredentials(res);
            
            observer.next();
          }, err => {
            observer.error(err);
          });
        });
      });
    }

    refreshAccessToken() : Promise<any> {
      if(!this.refreshing) {
        this.refreshing = true;

        return this.http.post(this.endpoint + '/oauth2/refresh', {
          grant_type: 'refresh_token',
          refresh_token: sessionStorage.getItem('refresh')
        }, {
          headers: this.headers
        }).toPromise().then(res => {
          this.updateUserCredentials(res);
          this.refreshing = false;
          return Promise.resolve();
        });
      } else {
        return new Promise(resolve => {
          setInterval(() => {
            if(!this.refreshing) {
              resolve();
            }
          }, 500);
        });
      }
    }

    updateUserCredentials(credentials) {
      sessionStorage.setItem('token', credentials.accessToken);
      sessionStorage.setItem('refresh', credentials.refreshToken);
      this.credentials = 'accessToken=' + credentials.accessToken;
    }

    hasCredentials() {    
      if(sessionStorage.getItem("authorization") && sessionStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    }

    getTodo() {        
      return this.http.get(this.endpoint + '/lists/' + this.lists[0].id + '/cards?' + this.credentials, {
        headers: this.headers
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            return this.getTodo();
          });
        } else {
          return Promise.reject(err);
        }
      })
    }

    getDoing() {
      return this.http.get(this.endpoint + '/lists/' + this.lists[1].id + '/cards?' + this.credentials, {
        headers: this.headers
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            return this.getDoing();
          });
        } else {
          return Promise.reject(err);
        }
      });
    }

    getDone() {
      return this.http.get(this.endpoint + '/lists/' + this.lists[2].id + '/cards?' + this.credentials, {
        headers: this.headers
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            return this.getDone();
          });
        } else {
          return Promise.reject(err);
        }
      });
    }

    getCard(card){
      return this.http.get(this.endpoint + '/cards/' + card.id + '?' + this.credentials, {
        headers: this.headers
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            return this.getCard(card);
          });
        } else {
          return Promise.reject(err);
        }
      });
    }

    delete(id) {
      return this.http.delete(this.endpoint + '/cards/' + id + '?' + this.credentials, {
        headers: this.headers
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            return this.delete(id);
          });
        } else {
          return Promise.reject(err);
        }
      });
    }

    newCard(card){
        return this.http.post(this.endpoint + '/cards?' + this.credentials, {name:  card.name, desc: card.desc, idList: card.idList}, {
          headers: this.headers
        }).toPromise().catch(err => {
          if(err.status === 401) {
            return this.refreshAccessToken().then(() => {
              return this.newCard(card);
            });
          } else {
            return Promise.reject(err);
          }
        });
    }

    newAttachment(idCard, attachment) {
        let formData:FormData = new FormData();
        formData.append('file', attachment, attachment.name);

        return this.http.post(this.endpoint + '/cards/' + idCard + '/attachments?' + this.credentials, formData, {
          headers: this.headers
        }).toPromise().catch(err => {
          if(err === 401) {
            return this.refreshAccessToken().then(() => {
              return this.newAttachment(idCard, attachment);
            });
          } else {
            return Promise.reject(err);
          }
        });
    }

    update(card) {
      return this.http.put(this.endpoint + '/cards/' + card.id + '?' + this.credentials, {name: card.name, desc: card.desc, idList: card.idList}, {
        headers: this.headers
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            this.update(card);
          });
        } else {
          return Promise.reject(err);
        }
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
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            return this.getCardAttachments(idCard);
          });
        } else {
          return Promise.reject(err);
        }
      });
    }

    deleteAttachment(idCard, idAttachment) {
      return this.http.delete(this.endpoint + '/cards/' + idCard + '/attachments/' + idAttachment + '?' + this.credentials, {
        headers: this.headers
      }).toPromise().catch(err => {
        if(err.status === 401) {
          return this.refreshAccessToken().then(() => {
            return this.deleteAttachment(idCard, idAttachment);
          });
        } else {
          return Promise.reject(err);
        }
      });
    }
}