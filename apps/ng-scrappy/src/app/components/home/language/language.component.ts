import { Component, Input } from '@angular/core';
import { ILanguage } from '@ng-scrappy/models';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent {
  @Input() lang: ILanguage;
}
