import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable()
export class TrelloService {
    private endpoint = 'https://api.trello.com/1';
    private credentials = 'key=7826a7def1803a362b55c90ac66ab5f1&token=397ec8296006a8e06835afdcbe0b3e4e6bacce8848945ac19870599d171a0959';
    private board = 'CeLcNDVU';
    private lists = [{id: '5b6b420b6125170fa01f86f0', name: 'To Do'},
        {id: '5b6b420c4dd9240f4b1e4f3f', name: 'Doing'},
        {id: '5b6b420d3579f37d55b18226', name: 'Done'}];

    constructor(private http: HttpClient) {
        
    }

    getAll() {
        return this.http.get(this.endpoint + '/boards/' + this.board + '/cards?' + this.credentials);
    }

    getTodo() {
        return this.http.get(this.endpoint + '/lists/' + this.lists[0].id + '/cards?' + this.credentials);
    }

    getDoing() {
        return this.http.get(this.endpoint + '/lists/' + this.lists[1].id + '/cards?' + this.credentials);
    }

    getDone() {
        return this.http.get(this.endpoint + '/lists/' + this.lists[2].id + '/cards?' + this.credentials);
    }

    getCard(card){
        return this.http.get(this.endpoint + '/cards/' + card.id + '?' + this.credentials);
    }

    delete(id) {
        return this.http.delete(this.endpoint + '/cards/' + id + '?' + this.credentials);
    }

    newCard(card){
        return this.http.post(this.endpoint + '/cards?' + this.credentials, {name:  card.nombre, desc: card.desc, idList: card.idList});
    }

    newAttachment(idCard, attachment) {
        let formData:FormData = new FormData();
        formData.append('file', attachment, attachment.name);

        return this.http.post(this.endpoint + '/cards/' + idCard + '/attachments?' + this.credentials, formData);
    }

    update(card) {
        return this.http.put(this.endpoint + '/cards/' + card.id + '?' + this.credentials, {name: card.name, desc: card.desc, idList: card.idList});
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
        return this.http.get(this.endpoint + '/cards/' + idCard + '/attachments?' + this.credentials);
    }

    deleteAttachment(idCard, idAttachment) {
        return this.http.delete(this.endpoint + '/cards/' + idCard + '/attachments/' + idAttachment + '?' + this.credentials);
    }
}