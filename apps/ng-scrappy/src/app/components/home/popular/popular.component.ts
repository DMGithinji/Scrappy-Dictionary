import { Component, Input } from '@angular/core';

@Component({
  selector: 'popular',
  templateUrl: './popular.component.html',
})
export class PopularComponent {

  @Input() language: string;
  @Input() word: string;

}
