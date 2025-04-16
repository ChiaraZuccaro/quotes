import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { ListComponent } from './ui/list/list.component';

const exploreRoutes = [
  { path: 'list', component: ListComponent }
];

export const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'explore',
    component: ExploreComponent,
    children: exploreRoutes
  },
  { path: '**', redirectTo: '/home' }
];