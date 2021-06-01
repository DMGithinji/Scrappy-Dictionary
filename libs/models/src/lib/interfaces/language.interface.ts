import { IObject } from "./db-object.interface";

export interface ILanguage extends IObject{
  language: string;
  description: string;
  /** A list of popular searches */
  popular: string[];

  votes?: number;
}
