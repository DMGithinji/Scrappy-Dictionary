import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { ILanguage, ITranslationResults, LanguageStatus } from '@ng-scrappy/models';


const LANGUAGE_PATH = 'dictionary';
const TRANSLATIONS_PATH = (lang) => `dictionary/${lang}/words`;


@Injectable({
  providedIn: 'root'
})
export class DictonaryService {

  constructor(
    private db: AngularFirestore) { }

  /**
   * Get list of languages and their data for a given language status
   */
  getLanguageData(status: LanguageStatus) {
    return this.db
      .collection<ILanguage>(LANGUAGE_PATH, ref => ref.where('status', '==', status))
      .valueChanges();
  }


  /**
   * Get list of languages and their data for a given language status
   */
  getLanguageWords(lang: string) {
    return this.db
      .collection<ITranslationResults>(TRANSLATIONS_PATH(lang), ref => ref.orderBy('word', 'asc'))
      .valueChanges();
  }

}
