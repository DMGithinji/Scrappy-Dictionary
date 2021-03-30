export interface Translation {
  id: string;
  word: string;
  meaning: string;
  example: string;
  translation: string;
  relatedWords: string[];
}

export interface Language {
  id: string;
  language: string;
}
