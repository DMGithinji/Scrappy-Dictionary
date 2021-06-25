import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrlListService } from '../../services/trlList.service';

@Component({
  selector: 'translation-list',
  templateUrl: './translation-list.component.html',
  styleUrls: ['./translation-list.component.scss']
})
export class TranslationListComponent implements OnInit {

  trlData$: Observable<any>;
  private _lang: string;

  spinnerCount = [...Array(5)]


  constructor(
    private _route: ActivatedRoute,
    private _trlStore$: TrlListService
    ) { }

  ngOnInit(): void {
    // 1. Get active lang
    const routeLang$ = this._route.params.pipe(map(params => params['language']));
    routeLang$.subscribe(lang => this._lang = lang);

    // 2. Load initial data
    this._trlStore$.setMore(this._lang);

    // 3. Subscribe to translation data store
    this.trlData$ = this._trlStore$.getData();


  }

  /** Performs subsequent data queries on data scroll */
  scrollHandler(e) {
    console.log(e)
    if (e === 'bottom') {
      this._trlStore$.setMore(this._lang)
    }
  }


}
