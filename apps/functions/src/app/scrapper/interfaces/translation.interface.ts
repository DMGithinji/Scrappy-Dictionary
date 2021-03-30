import { firestore } from 'firebase-admin';

export interface IObject {
  id?: string;
  createdAt?: firestore.Timestamp;
}

export interface ITranslationResults extends IObject {
  word: string;
  meaning: string;
  example: string;
  translation: string;
  language?: string;
}
export interface ITranslationLinkData {
  word: string;
  trlLink: string;
  language: string;
}
