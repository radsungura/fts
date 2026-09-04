import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/login/login';
import { Documents } from './features/documents/documents';
import { Users } from './features/users/users';
import { Archive } from './features/archive/archive';
import { Borrow } from './features/borrow/borrow';
import { Search } from './features/search/search';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: Dashboard },
        { path: 'documents', component: Documents },
        { path: 'search', component: Search },
        { path: 'borrow', component: Borrow },
        { path: 'archive', component: Archive },
        { path: 'users', component: Users }
    ],
  },
  { path: 'login', component: Login },
];
