import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILanguage, LanguageStatus } from '@ng-scrappy/models';

import { ActiveLangService } from '../../services/active-lang.service';
import { DictonaryService } from '../../services/dictonary.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  lang$: Observable<ILanguage>;
  supportedLangs$: Observable<ILanguage[]>

  constructor(
    private _dict$: DictonaryService,
    private _lang$: ActiveLangService) {}

  ngOnInit(): void {

    const activeLang$ = this._lang$.getActiveLang();
    this.supportedLangs$ = this._dict$.getLanguageData(LanguageStatus.Supported);

    this.lang$ = combineLatest([activeLang$, this.supportedLangs$])
                  .pipe(map(([active, langs]) => langs.find(l => l.language === active)));

  }
}
