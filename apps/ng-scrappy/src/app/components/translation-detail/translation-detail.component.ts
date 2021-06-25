import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ITranslationResults } from '@ng-scrappy/models';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'translation-detail',
  templateUrl: './translation-detail.component.html',
  styleUrls: ['./translation-detail.component.scss']
})
export class TranslationDetailComponent implements OnInit {

  trlData$: Observable<ITranslationResults>;

  constructor(
    private _route: ActivatedRoute,
    private _dict$: DbService) { }

  ngOnInit(): void {
    const queryData$ = this._route.params.pipe(map(params => {
      const { language, word } = params;
      return { language, word }
    }));

    this.trlData$ = queryData$.pipe(switchMap(query => {
      return this._dict$.getWordTrl(query.language, query.word);
    }))
  }

}
