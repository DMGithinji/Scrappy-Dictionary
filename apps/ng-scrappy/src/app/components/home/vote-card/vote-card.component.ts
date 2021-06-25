import { Component, OnInit } from '@angular/core';
import { ILanguage, LanguageStatus } from '@ng-scrappy/models';
import { combineLatest, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { DbService } from '../../../services/db.service';
import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-vote-card',
  templateUrl: './vote-card.component.html'
})
export class VoteCardComponent implements OnInit {

  data$: Observable<{langs: ILanguage[], hasVoted: boolean}>

  constructor(
    private _dict$: DbService,
    private _voteService: VoteService) { }

  ngOnInit(): void {
    const lang$ = this._dict$.getLanguageData(LanguageStatus.Unsupported, 5);
    const hasVoted$ = this._voteService.getHasVoted();
    this.data$ = combineLatest([lang$, hasVoted$])
                  .pipe(map(([langs, hasVoted]) => ({ langs, hasVoted })));

  }

  castVote = (lang: ILanguage) => {
    this.data$
      .pipe(take(1), tap(data => {
        if (data.hasVoted) { return }

        this._voteService.vote(lang);
      }))
      .subscribe();
  };

}
