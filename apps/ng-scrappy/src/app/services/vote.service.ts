import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ILanguage, LanguageStatus } from '@ng-scrappy/models';
import { DbService } from './db.service';

const USER_LANGUAGE_VOTES = 'ng_user_language_votes';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private _db: DbService) {}

  /**
   * Sets cast vote
   * 1. Sets vote in local storage to facilitate prevention of multicasts
   * 2. Persists vote in db
   */
  vote(lang: ILanguage) {
    this._setToLocalStorage(lang.language);
    this._db.setLangVote(lang);
  }

  /** Boolean used to track if user has voted for current language-set*/
  getHasVoted() {

    return this._db.getLanguageData(LanguageStatus.Unsupported).pipe(map(langs => {
      return this._getHasVoted(langs, this._getLocalStorageVotes());
    }))
  }


  /// HELPERS
  private _getHasVoted(dbUnsupportedLangs: ILanguage[],localStoreVotes: string[]) {
    return  !localStoreVotes || !localStoreVotes.length || !dbUnsupportedLangs
                ? false
                : !!localStoreVotes.filter((l) => dbUnsupportedLangs.map((l) => l.language).includes(l)).length;
  }

  private _getLocalStorageVotes() {
    return JSON.parse(localStorage.getItem(USER_LANGUAGE_VOTES)) ?? [];
  }

  private _setToLocalStorage(lang: string) {
    const localVotes = this._getLocalStorageVotes();
    const newCast = !localVotes ? [lang] : [...localVotes, lang];
    localStorage.setItem(USER_LANGUAGE_VOTES, JSON.stringify(newCast));
  }

}
