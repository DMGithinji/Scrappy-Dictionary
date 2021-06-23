import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveLangService } from './shared/services/active-lang.service';

@Component({
  selector: 'ng-scrappy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  activeLang$: Observable<string>;

  constructor(private _lang: ActiveLangService) {

  }
  ngOnInit() {
    this.activeLang$ = this._lang.getActiveLang();
  }

}
