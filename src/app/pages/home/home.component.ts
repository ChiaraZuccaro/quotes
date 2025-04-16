import { Component, inject, OnInit, signal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuotesService } from '@services/quotes.service';
import { SeoService } from '@services/seo.service';
import { catchError, finalize, throwError } from 'rxjs';

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
  public errorMessage: string;
  public isLoading = signal(true);

  ngOnInit(): void {
    this._seoService.updateMetaTag('home');
    this.getQuote();
  }

  public saveAsFavorite() {
    this.randomQuote.isFavorite = true;
    this.saveQuote();
  }

  public getQuote() {
    this.isLoading.set(true);
    this._quoteService.getRandomQuote().pipe(
      catchError(err =>  throwError(() => err)),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: newQuote => this.randomQuote = newQuote,
      error: err => this.errorMessage = err.message
    });
  }

  public saveQuote() {
    this._quoteService.saveQuote(this.randomQuote);
    this.getQuote();
  }
}
