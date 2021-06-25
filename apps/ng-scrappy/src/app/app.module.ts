import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';

import { NgAisModule } from 'angular-instantsearch';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ActiveLangSelectorComponent } from './components/active-lang-selector/active-lang-selector.component';
import { TranslationListComponent } from './components/translation-list/translation-list.component';
import { TranslationDetailComponent } from './components/translation-detail/translation-detail.component';
import { SearchComponent } from './components/search/search.component';
import { LanguageComponent } from './components/home/language/language.component';
import { PopularComponent } from './components/home/popular/popular.component';
import { HomeComponent } from './components/home/home.component';
import { TranslationOverviewComponent } from './components/translation-list/translation-overview/translation-overview.component';
import { VoteCardComponent } from './components/home/vote-card/vote-card.component';

import { TrlListService } from './services/trlList.service';
import { ScrollableDirective } from './directives/scrollable.directive';


@NgModule({
  declarations: [
    AppComponent,
    ActiveLangSelectorComponent,
    HomeComponent,
    TranslationListComponent,
    TranslationDetailComponent,
    SearchComponent,
    LanguageComponent,
    PopularComponent,
    TranslationOverviewComponent,
    ScrollableDirective,
    VoteCardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgAisModule.forRoot()
  ],
  providers: [TrlListService],
  bootstrap: [AppComponent],
})
export class AppModule {}
