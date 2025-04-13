import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'nav-custom',
  imports: [ RouterLink ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  private _routes = inject(ActivatedRoute);
  public navLinks = [
    { viewName: 'your list', link: '/user' },
    { viewName: 'explore', link: '/explore' }
  ];

  ngOnInit(): void {
    this._routes.url.subscribe(url => {
      
    })
  }
}
