import { Routes } from '@angular/router';
import { Welcome } from './components/welcome/welcome';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'welcome', component: Welcome },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
