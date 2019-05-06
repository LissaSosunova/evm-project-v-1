import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], query: string, field: string): any {
    let result: any[];
    if (!value) {
      return [];
    }
    if (!query || query === '') {
      return value;
    }

    query = query.toLowerCase();
    value = value.filter(item => !!item[field]);
    result = value.filter(item => {
      return item[field].toLowerCase().includes(query);
    });
    return result;
  }
}
