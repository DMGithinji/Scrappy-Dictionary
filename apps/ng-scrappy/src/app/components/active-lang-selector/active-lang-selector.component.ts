import { Component, OnInit } from '@angular/core';
import { ILanguage, LanguageStatus } from '@ng-scrappy/models';
import { Observable } from 'rxjs';
import { DbService } from '../../services/db.service';
import { ActiveLangService } from '../../services/active-lang.service';
import { Router } from '@angular/router';
@Component({
  selector: 'active-lang-selector',
  templateUrl: './active-lang-selector.component.html',
  styleUrls: ['./active-lang-selector.component.scss'],
})
export class ActiveLangSelectorComponent implements OnInit {
  activeLang$: Observable<string>;
  langs$: Observable<ILanguage[]>;

  constructor(
    private _activeLang$: ActiveLangService,
    private _dict: DbService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.langs$ = this._dict.getLanguageData(LanguageStatus.Supported);
    this.activeLang$ = this._activeLang$.getActiveLang();
  }

  setActiveLang(lang: string) {
    this._activeLang$.setActiveLang(lang);
    this._router.navigate(['/', lang]);
  }
}
