import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable()
export class TrelloService {
    endpoint = 'https://api.trello.com/1';
    credentials = 'key=7826a7def1803a362b55c90ac66ab5f1&token=397ec8296006a8e06835afdcbe0b3e4e6bacce8848945ac19870599d171a0959';
    board = 'CeLcNDVU';

    constructor(private http: HttpClient) {
        
    }

    getAll() {
        return this.http.get(this.endpoint + '/boards/' + this.board + '/cards?' + this.credentials);
    }

    delete(id) {
        return this.http.delete(this.endpoint + '/cards/' + id + '?' + this.credentials);
    }
}