import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './ui/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, NavComponent ],
  template: `
  <nav></nav>
  <router-outlet/>
  `,
  styles: ``
})
export class AppComponent {}
