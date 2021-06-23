import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { ILanguage, LanguageStatus } from '@ng-scrappy/models';


const LANGUAGE_PATH = 'dictionary';


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

}
