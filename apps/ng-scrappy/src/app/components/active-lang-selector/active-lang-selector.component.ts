import { Component, OnDestroy, OnInit } from '@angular/core';
import { ILanguage, LanguageStatus } from '@ng-scrappy/models';
import { Observable } from 'rxjs';
import { DictonaryService } from '../../shared/services/dictonary.service';
import { ActiveLangService } from '../../shared/services/active-lang.service';
@Component({
  selector: 'active-lang-selector',
  templateUrl: './active-lang-selector.component.html',
  styleUrls: ['./active-lang-selector.component.scss']
})
export class ActiveLangSelectorComponent implements OnInit {

  activeLang$: Observable<string>;
  langs$: Observable<ILanguage[]>;

  constructor(
    private _dict: DictonaryService,
    private _activeLang$: ActiveLangService) {}

  ngOnInit(): void {
    this.langs$ = this._dict.getLanguageData(LanguageStatus.Supported);
    this.activeLang$ = this._activeLang$.getActiveLang();
  }

  setActiveLang(lang: string) {
    this._activeLang$.setActiveLang(lang);
  }

}
