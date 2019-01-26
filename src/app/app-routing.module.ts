import { RouterModule, Routes } from '@angular/router';
import { CardListComponent } from './cardlist/cardlist.component';
import { CardDetailComponent } from './carddetail/carddetail.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default route
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'cards/new', component: CardDetailComponent },
  { path: 'cards', component: CardListComponent },
  { path: 'details/:id', component: CardDetailComponent }
];

export const routing = RouterModule.forRoot(routes);
