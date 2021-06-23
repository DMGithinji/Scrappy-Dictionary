import { Component, OnInit } from '@angular/core';
import { ILanguage, LanguageStatus } from '@ng-scrappy/models';
import { Observable } from 'rxjs';
import { DictonaryService } from '../../services/dictonary.service';

@Component({
  selector: 'active-lang-selector',
  templateUrl: './active-lang-selector.component.html',
  styleUrls: ['./active-lang-selector.component.scss']
})
export class ActiveLangSelectorComponent implements OnInit {

  langs$: Observable<ILanguage[]>;

  constructor(private _dict: DictonaryService) { }

  ngOnInit(): void {
    this.langs$ = this._dict.getLanguageData(LanguageStatus.Supported);
  }

}
