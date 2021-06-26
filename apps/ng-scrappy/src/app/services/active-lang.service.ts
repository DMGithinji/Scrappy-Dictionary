import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_LANG = 'swahili';
const ACTIVE_LANG_KEY = 'ng_scrappy_active_lang';

@Injectable({
  providedIn: 'root',
})
export class ActiveLangService {
  private _activeLang = localStorage.getItem(ACTIVE_LANG_KEY) ?? DEFAULT_LANG;
  activeLang$ = new BehaviorSubject<string>(this._activeLang);

  setActiveLang(lang: string) {
    this.activeLang$.next(lang);
    localStorage.setItem(ACTIVE_LANG_KEY, lang);
  }

  getActiveLang() {
    return this.activeLang$;
  }
}
