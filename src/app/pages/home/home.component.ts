import { Component, inject, OnInit, signal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuotesService } from '@services/quotes.service';
import { SeoService } from '@services/seo.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _quoteService = inject(QuotesService);

  public randomQuote: Quote;
  public isLoading = signal(true);

  ngOnInit(): void {
    this._seoService.updateMetaTag('home');
    this.getQuote();
  }

  public saveAsFavorite() {
    this.randomQuote.isFavorite = true;
    this.saveQuote();
    this.getQuote();
  }

  public getQuote() {
    this.isLoading.set(true);
    this._quoteService.getRandomQuote().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe(newQuote => this.randomQuote = newQuote);
  }

  public saveQuote() {
    this._quoteService.saveQuoteInUserList(this.randomQuote);
    this.getQuote();
  }
}
