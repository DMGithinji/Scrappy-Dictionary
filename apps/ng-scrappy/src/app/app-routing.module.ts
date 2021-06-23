import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TranslationDetailComponent } from './components/translation-detail/translation-detail.component';
import { TranslationListComponent } from './components/translation-list/translation-list.component';

const routes: Routes = [
  { path: '**', component: HomeComponent },
  { path: ':language', component: HomeComponent },
  { path: ':language/words', component: TranslationListComponent },
  { path: ':language/:word', component: TranslationDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
