import { RouterModule, Routes } from '@angular/router';
import { NewcardComponent } from './newcard/newcard.component';
import { CardListComponent } from './cardlist/cardlist.component';

const routes: Routes = [
  { path: '', redirectTo: 'cards', pathMatch: 'full' }, // default route
  { path: 'newcard', component: NewcardComponent },
  { path: 'cards', component: CardListComponent }
];

export const routing = RouterModule.forRoot(routes);
