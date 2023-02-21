import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(fields: any, text: string): any[] {
    if (text.length === 0) { return fields; }

    text = text.toLocaleLowerCase();

    return fields.filter(item => {
      return item.per_nom.toLocaleLowerCase().includes(text);
    });
  }

}
