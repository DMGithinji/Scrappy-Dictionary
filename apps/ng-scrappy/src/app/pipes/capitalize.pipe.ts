import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {

  public transform(text: string): string {
    return text.slice(0,1).toUpperCase() + text.slice(1);
  }
}
