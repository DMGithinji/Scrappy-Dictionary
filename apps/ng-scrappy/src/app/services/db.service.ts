import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILanguage, ITranslationResults, LanguageStatus } from '@ng-scrappy/models';

const LANGUAGE_PATH = 'dictionary';
const TRANSLATIONS_PATH = (lang) => `dictionary/${lang}/words`;

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private db: AngularFirestore) { }

  /**
   * Get list of languages and their data for a given language status
   */
  getLanguageData(status: LanguageStatus, limit?: number) {

    if (!limit) {
      return this.db.collection<ILanguage>(LANGUAGE_PATH, ref =>
          ref.where('status', '==', status)
              .orderBy('wordCount', 'desc'))
            .valueChanges();
    }

    return this.db.collection<ILanguage>(LANGUAGE_PATH, ref =>
      ref.where('status', '==', status)
          .limit(limit))
        .valueChanges();
  }


  /**
   * Get list of languages and their data for a given language status
   */
  getLanguageWords(lang: string) {
    return this.db.collection<ITranslationResults>(TRANSLATIONS_PATH(lang), ref => ref.orderBy('word', 'asc'))
      .valueChanges();
  }


  /**
   * Get list of languages and their data for a given language status
   */
  getWordTrl(lang: string, word: string): Observable<ITranslationResults> {
    return this.db
      .collection<ITranslationResults>(TRANSLATIONS_PATH(lang), ref => ref.where('word', '==', word))
      .valueChanges()
      .pipe(map(words => {
        if (words[0]) { return words[0] }
        throw new Error('No word found');
      }));
  }

  setLangVote(lang: ILanguage) {
    lang.votes += 1;
    this.db.collection<ITranslationResults>(LANGUAGE_PATH)
      .doc(lang.language)
      .update(lang);
  }

}
