import { Component, inject } from '@angular/core';
import { QuoteCardComponent } from '../quote-card/quote-card.component';
import { QuotesService } from '@services/quotes.service';
import { Quote } from '@entity/Quote.class';

@Component({
  selector: 'ctas',
  imports: [QuoteCardComponent],
  templateUrl: './ctas.component.html',
  styleUrl: './ctas.component.scss'
})
export class CtasComponent {
  private _quotesService = inject(QuotesService);

  public isCreateModeOn = true;
  public newQuote: Quote;

  constructor() {
    const quoteInitConfig = structuredClone(this._quotesService.initQuote);
    this.newQuote = new Quote(quoteInitConfig);
  }
}
