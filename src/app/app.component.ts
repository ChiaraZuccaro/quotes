import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './ui/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet ],
  template: `
  <!-- <nav-custom></nav-custom> -->
  <!-- <div class="container_wrap"> -->
    <router-outlet/>
  <!-- </div> -->
  `,
  styles: `
  nav-custom { display: block; height: 50px; }
  .container_wrap {
    height: calc(100% - 50px);
    router-outlet { display: none; }
  }`
})
export class AppComponent {}
