import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { UserComponent } from './pages/user/user.component';

const userRoutes = [
  {}
];

const exploreRoutes = [
  {}
];

export const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'explore',
    component: ExploreComponent,
    children: exploreRoutes
  },
  {
    path: 'user',
    component: UserComponent,
    children: userRoutes
  },
  { path: '**', redirectTo: '/home' }
];