import { Routes } from '@angular/router';
import { Welcome } from './components/welcome/welcome';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'welcome', component: Welcome },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
