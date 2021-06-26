import { ITranslationLinkData } from '@ng-scrappy/models';

/** Information used for web scrapping */
export interface ETLData {
  trlLinks: ITranslationLinkData[];
  scrapeData: IScrapeData;
}

/** Information relevant for initializing web scrapping */
export interface IScrapeData {
  languages: string[];
  isInitialScrape: boolean;
}
