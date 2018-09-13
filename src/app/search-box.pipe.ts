import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'searchBox'
})

@Injectable()
export class SearchBoxPipe implements PipeTransform {
 transform(items: any[], value: string): any[] {
    if(!items) return [];
    if(!value) return items;
    return items.filter( it => it["name"].toLowerCase().includes(value.toLowerCase()));
  }
}