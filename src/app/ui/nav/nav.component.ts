import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'nav-custom',
  imports: [ RouterLink, RouterLinkActive ],
  template: `
  <nav>
    @for (item of navLinks; track $index) {
      <a [routerLink]="item.link" routerLinkActive="active">{{item.viewName}}</a>
    }
  </nav>`,
  styles: `
  nav {
    position: absolute;
    height: 50px;
    width: 100%;
    background-color: white;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    a {
      text-decoration: none;
      color: black;

      &.active {
        text-decoration: underline;
      }
    }
  }`
})
export class NavComponent {
  public navLinks = [
    { viewName: 'your list', link: '/user' },
    { viewName: 'explore', link: '/explore' }
  ];
}
