import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], field: string): any[] {
    if (!value || !field) {
      return value;
    }

    return value.sort((a, b) => a[field] - b[field]); 
  }

}
