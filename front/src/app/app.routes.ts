import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/login/login';
import { Documents } from './features/documents/documents';
import { Repos } from './features/repos/repos';
import { Users } from './features/users/users';
import { Archive } from './features/archive/archive';
import { Borrow } from './features/borrow/borrow';
import { Search } from './features/search/search';
import { Audit } from './features/audit/audit';
import { Services } from './features/services/services';
import { Categories } from './features/categories/categories';

export const routes: Routes = [
  {
    path: '', component: Layout,
    
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: Dashboard },
        { path: 'documents', component: Documents },
        { path: 'repos', component: Repos },
        { path: 'search', component: Search },
        { path: 'borrow', component: Borrow },
        { path: 'archive', component: Archive },
        { path: 'users', component: Users },
        { path: 'audit', component: Audit },
        { path: 'services', component: Services },
        { path: 'categories', component: Categories }
    ],
  },
  { path: 'login', component: Login },
];
