import { RouterModule, Routes } from '@angular/router';
import { NewcardComponent } from './newcard/newcard.component';
import { CardListComponent } from './cardlist/cardlist.component';
import { CardDetailComponent } from './carddetail/carddetail.component';

const routes: Routes = [
  { path: '', redirectTo: 'cards', pathMatch: 'full' }, // default route
  { path: 'newcard', component: CardDetailComponent },
  { path: 'cards', component: CardListComponent },
  { path: 'details/:id', component: CardDetailComponent }
];

export const routing = RouterModule.forRoot(routes);
