import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable()
export class TrelloService {
    private endpoint = 'https://api.trello.com/1';
    private credentials = 'key=7826a7def1803a362b55c90ac66ab5f1&token=397ec8296006a8e06835afdcbe0b3e4e6bacce8848945ac19870599d171a0959';
    private board = 'CeLcNDVU';

    constructor(private http: HttpClient) {
        
    }

    getAll() {
        return this.http.get(this.endpoint + '/boards/' + this.board + '/cards?' + this.credentials);
    }

    getCard(card){
        return this.http.get(this.endpoint + '/cards/' + card.id + '?' + this.credentials);
    }

    delete(id) {
        return this.http.delete(this.endpoint + '/cards/' + id + '?' + this.credentials);
    }

    newCard(name, desc){
        return this.http.post(this.endpoint + '/cards?name=' + name + '&desc=' + desc + '&idList=5b6b420b6125170fa01f86f0' + '&' + this.credentials, '');
    }

    update(card) {
        return this.http.put(this.endpoint + '/cards/' + card.id + '?' + this.credentials, {name: card.name, desc: card.desc});
    }
}