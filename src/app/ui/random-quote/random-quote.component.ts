import { Component, inject, OnInit, signal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuotesService } from '@services/quotes.service';
import { catchError, throwError, finalize } from 'rxjs';

@Component({
  selector: 'random-quote',
  imports: [],
  templateUrl: './random-quote.component.html',
  styleUrl: './random-quote.component.scss'
})
export class RandomQuoteComponent implements OnInit {
  private _quoteService = inject(QuotesService);

  public randomQuote: Quote;
  public errorMessage: string;
  public isLoading = signal(true);

  ngOnInit(): void {
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
