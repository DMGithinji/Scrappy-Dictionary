import { IObject } from './db-object.interface';

export interface ILanguage extends IObject {
  language: string;
  description: string;
  /** A list of popular searches */
  popular: string[];

  status: LanguageStatus;

  votes?: number;
  wordCount?: number;
}

export enum LanguageStatus {
  Unsupported = 'not-supported',
  Scrapping = 'scraping',
  Supported = 'supported'
}
