import { Component, computed, inject } from '@angular/core';
import { QuoteCardComponent } from '../quote-card/quote-card.component';
import { QuotesService } from '@services/quotes.service';
import { Quote } from '@entity/Quote.class';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ctas',
  imports: [ RouterLink ,QuoteCardComponent ],
  templateUrl: './ctas.component.html',
  styleUrl: './ctas.component.scss'
})
export class CtasComponent {
  private _quotesService = inject(QuotesService);

  public isCreateModeOn = computed(() => this._quotesService.isCreatingMode());
  public newQuote: Quote;

  constructor() {
    const quoteInitConfig = structuredClone(this._quotesService.initQuote);
    this.newQuote = new Quote(quoteInitConfig);
  }

  public activeCreatingMode() {
    this._quotesService.isCreatingMode.set(!this._quotesService.isCreatingMode());
  }
}
