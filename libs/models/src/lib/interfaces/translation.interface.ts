import { IObject } from "./db-object.interface";

export interface ITranslation {
  word: string;
  meaning: string;
  example: string;
  translation: string;
  language?: string;
  relatedWords: string[];
}

export interface ITranslationResults extends IObject, ITranslation {

}
