import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ITranslation, ITranslationResults } from '@ng-scrappy/models';

const LANG_PATH = (lang) => `dictionary/${lang}/words`;
const QUERY_LIMIT = 5;

/**
 * Manages application state of translations data queried from db and loaded into app
 *
 * - Enables infinite scrolling ie querying of db data in batches and combining each batch to application's state
 * - If the language changes, clears the loaded translation data and starts a new translations batch
 */
@Injectable()
export class TrlListService {
  // Application state data
  private _done$$ = new BehaviorSubject(false);
  private _loading$$ = new BehaviorSubject(false);
  private _trlList$$ = new BehaviorSubject<ITranslationResults[]>([]);

  constructor(private db: AngularFirestore) {}

  /** Returns an object with state loaded translation data, load status and done status */
  getData() {
    const trlData$ = this._trlList$$.asObservable();
    const done$ = this._done$$.asObservable();
    const loading$ = this._loading$$.asObservable();

    return combineLatest([trlData$, loading$, done$]).pipe(
      map(([trlData, loading, done]) => {
        return { trlData, loading, done };
      })
    );
  }

  /** Triggers firestore query for next set of data then updates the translation data store state */
  setMore(lang: string) {
    const data = this._trlList$$.value;
    if (data.length && data[0].language !== lang) {
      this._trlList$$.next([]);
    }

    this._loading$$.next(true);

    const query = this.db.collection<ITranslation>(LANG_PATH(lang), (ref) => {
      return ref
        .orderBy('word', 'asc')
        .limit(QUERY_LIMIT)
        .startAfter(this._getCursor());
    });

    query
      .valueChanges()
      .pipe(take(1))
      .subscribe((data) => {
        this._trlList$$.next([...this._trlList$$.value, ...data]);

        this._loading$$.next(false);

        if (!data.length) {
          this._done$$.next(true);
        }
      });
  }

  /// HELPERS
  /** Used for paginated queries */
  private _getCursor() {
    const data = this._trlList$$.value;
    if (data.length) {
      return data.slice(-1)[0].word;
    }
    return null;
  }
}
