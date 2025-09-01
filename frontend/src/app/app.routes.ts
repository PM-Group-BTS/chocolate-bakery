import { Routes } from '@angular/router';
import { Welcome } from './components/welcome/welcome';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'welcome', component: Welcome },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
