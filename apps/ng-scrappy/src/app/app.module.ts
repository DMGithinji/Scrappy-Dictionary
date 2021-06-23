import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ActiveLangSelectorComponent } from './components/active-lang-selector/active-lang-selector.component';
import { TranslationListComponent } from './components/translation-list/translation-list.component';
import { TranslationDetailComponent } from './components/translation-detail/translation-detail.component';
import { SearchComponent } from './components/search/search.component';
import { LanguageComponent } from './components/home/language/language.component';
import { PopularComponent } from './components/home/popular/popular.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    ActiveLangSelectorComponent,
    HomeComponent,
    TranslationListComponent,
    TranslationDetailComponent,
    SearchComponent,
    LanguageComponent,
    PopularComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
