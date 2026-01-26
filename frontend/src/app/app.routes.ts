import { Routes } from '@angular/router';
import { Welcome } from './components/welcome/welcome';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'welcome', component: Welcome },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
