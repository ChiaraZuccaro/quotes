import { Component, inject, Input } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuotesService } from '@services/quotes.service';

@Component({
  selector: 'quote-card',
  imports: [],
  templateUrl: './quote-card.component.html',
  styleUrl: './quote-card.component.scss'
})
export class QuoteCardComponent {
  private _quotesService = inject(QuotesService);

  public shareItems = [
    {
      icon: 'icon-clipboard',
      fn: this.copyQuote
    },
    {
      icon: 'icon-whatsapp',
      fn: () => { console.log('share on whatsapp!') }
    },
    {
      icon: 'icon-facebook',
      fn: () => { console.log('share on facebook!') }
    },
    {
      icon: 'icon-linkedin',
      fn: () => { console.log('share on linkedin!') }
    }
  ];

  @Input() quote: Quote;

  public changeFavorites() {
    this.quote.isFavorite = !this.quote.isFavorite;
  }

  public changePinned() {
    this.quote.isPinned = !this.quote.isPinned;
    this._quotesService.updateListTrigger.set(Math.random());
  }

  public copyQuote(quote: Quote) {
    const formatText = `${quote.description}\n(Author: ${quote.author})`;
    navigator.clipboard.writeText(formatText).then(() => console.log('Copied!'));
  }

  public showSocials() {
    this.quote.areSocialShown = !this.quote.areSocialShown;
  }
}