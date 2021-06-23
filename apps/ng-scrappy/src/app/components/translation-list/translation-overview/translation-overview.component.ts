import { Component, Input } from '@angular/core';
import { ITranslationResults } from '@ng-scrappy/models';

@Component({
  selector: 'app-translation-overview',
  templateUrl: './translation-overview.component.html'
})
export class TranslationOverviewComponent {

  @Input() trl: ITranslationResults;

}
