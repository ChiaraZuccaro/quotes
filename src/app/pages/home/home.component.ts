import { Component, inject, OnInit } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private _seoService = inject(SeoService);

  public randomQuote: Quote;

  ngOnInit(): void {
    this._seoService.updateMetaTag('home');
    this.getQuote();
  }

  public addQuoteToFavorite() {

  }

  public getQuote() {

  }

  public saveQuote() {

  }
}
