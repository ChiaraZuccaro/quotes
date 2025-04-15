import { Component, inject, Input, OnDestroy } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { ShareItem } from '@interfaces/quote-card.interface';
import { QuotesService } from '@services/quotes.service';
import { SHARE_SOCIAL } from '@utils/social-links';

@Component({
  selector: 'quote-card',
  imports: [],
  templateUrl: './quote-card.component.html',
  styleUrl: './quote-card.component.scss'
})
export class QuoteCardComponent implements OnDestroy {
  private _quotesService = inject(QuotesService);
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  public shareItems: ShareItem[] = [
    {
      copied: false,
      icon: 'icon-clipboard',
      fn: (quote, $index) => this.copyQuote(quote, $index),
      name: 'copy'
    },
    {
      copied: false,
      icon: 'icon-whatsapp',
      fn: (quote, $index) => this.shareLink(quote, $index),
      name: 'whatsapp'
    },
    {
      copied: false,
      icon: 'icon-facebook',
      fn: (quote, $index) => this.shareLink(quote, $index),
      name: 'facebook'
    },
    {
      copied: false,
      icon: 'icon-linkedin',
      fn: (quote, $index) => this.shareLink(quote, $index),
      name: 'linkedin'
    }
  ];

  @Input() quote: Quote;

  ngOnDestroy(): void {
    this.timeoutIds.forEach(id => clearTimeout(id));
  }

  private shareLink(quote: Quote, index: number) {
    const shareItem = this.shareItems[index];
    const config = SHARE_SOCIAL[shareItem.name];

    if(!config) throw new Error('Missing social!');
    const origin = window.location.origin;
    let shareUrl = config.link + encodeURIComponent(origin);

    if(config.hasText) {
      shareUrl = config.link + encodeURIComponent(`${quote.description}\n(Author: ${quote.author})`);
    } else { this.copyQuote(quote, index) }

    window.open(shareUrl, '_blank', 'width=700,height=500');
  }

  private copyQuote(quote: Quote, index: number) {
    this.shareItems[index].copied = true;
    const formatText = `${quote.description}\n(Author: ${quote.author})`;
    navigator.clipboard.writeText(formatText).then(() => {
      this.timeoutIds.push(setTimeout(() => this.shareItems[index].copied = false, 1800));
    });
  }

  public changeFavorites() {
    this.quote.isFavorite = !this.quote.isFavorite;
  }

  public changePinned() {
    this.quote.isPinned = !this.quote.isPinned;
    this._quotesService.updateListTrigger.set(Math.random());
    this._quotesService.saveQuotes();
  }

  public showSocials() {
    this.quote.areSocialShown = !this.quote.areSocialShown;
  }

  public delete() {
    this._quotesService.deleteQuote(this.quote.id);
  }
}