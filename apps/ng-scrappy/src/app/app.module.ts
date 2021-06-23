import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ActiveLangSelectorComponent } from './components/active-lang-selector/active-lang-selector.component';
import { TranslationListComponent } from './components/translation-list/translation-list.component';
import { TranslationDetailComponent } from './components/translation-detail/translation-detail.component';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  declarations: [AppComponent, ActiveLangSelectorComponent, TranslationListComponent, TranslationDetailComponent, SearchComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
