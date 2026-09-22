import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { MyShifts } from './pages/my-shifts/my-shifts';
import { ShiftForm } from './pages/shift-form/shift-form';
import { EditProfile } from './pages/edit-profile/edit-profile';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component:Login},
    {path: 'register', component:Register},
    {path: 'home', component:Home},
    {path: 'my-shifts', component:MyShifts},
    {path: 'add-shift', component:ShiftForm},
    {path: 'edit-shift/:id', component:ShiftForm},
    {path: 'edit-profile', component:EditProfile},
];