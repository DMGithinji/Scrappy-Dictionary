import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITranslationResults } from '@ng-scrappy/models';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DictonaryService } from '../../shared/services/dictonary.service';

@Component({
  selector: 'translation-list',
  templateUrl: './translation-list.component.html',
  styleUrls: ['./translation-list.component.scss']
})
export class TranslationListComponent implements OnInit {

  translations$: Observable<ITranslationResults[]>;

  constructor(
    private _route: ActivatedRoute,
    private _dict$: DictonaryService
    ) { }

  ngOnInit(): void {
    const routeLang$ = this._route.params.pipe(map(params => params['language']));
    this.translations$ = routeLang$.pipe(switchMap(lang => this._dict$.getLanguageWords(lang)));
  }

}
