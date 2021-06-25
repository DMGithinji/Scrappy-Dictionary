import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ITranslationResults } from '@ng-scrappy/models';
import { environment } from '../../../../src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  algoliaConfig = environment.algoliaConfig;

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private _router: Router) { }

  goTo(hit: ITranslationResults) {
    this._router.navigate(['/', hit.language, 'words', hit.word]);
    const el = this._document.querySelector('.ais-SearchBox-resetIcon');
    el.parentElement.click();
  }

}
