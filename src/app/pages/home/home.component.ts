import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private _seoService = inject(SeoService);

  ngOnInit(): void {
    this._seoService.updateMetaTag('home');
  }
}
