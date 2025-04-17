import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quote } from '@entity/Quote.class';
import { ShareItem } from '@interfaces/quote-card.interface';
import { QuotesService } from '@services/quotes.service';
import { SHARE_SOCIAL } from '@utils/social-links';

@Component({
  selector: 'quote-card',
  imports: [ DatePipe, FormsModule ],
  templateUrl: './quote-card.component.html',
  styleUrl: './quote-card.component.scss'
})
export class QuoteCardComponent implements OnInit, OnDestroy {
  private _quotesService = inject(QuotesService);
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  public isEditMode: boolean = false;
  public isCreatingMode: boolean = false;
  public newDescription: string;
  public newAuthor: string;

  public shareItems: ShareItem[] = [{
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
  },
  {
    copied: false,
    icon: 'icon-x',
    fn: (quote, $index) => this.shareLink(quote, $index),
    name: 'x'
  }];

  @Input() quote: Quote;

  ngOnInit(): void {
    this.isEditMode = this.isCreatingMode = this.setCreatingMode();
    this.newDescription = this.quote.description;
    this.newAuthor = this.quote.author;
  }

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
  
  private setCreatingMode() {
    return this.quote.description === '' && !this.quote.addedDate && this.quote.id === '';
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

  public saveEdit() {
    if(this.newDescription === '') {
      this.newDescription = 'You need to write at least one character!';
      this.timeoutIds.push(setTimeout(() => this.newDescription = this.quote.description, 1500));
      return;
    }
    this.changeEditMode();

    this.quote.description = this.newDescription;
    this.quote.author = this.newAuthor === '' ? 'Anonymous' : this.newAuthor;
    this.quote.author_slug = this.quote.author.toLowerCase().replace(' ', '-');

    if(this.isCreatingMode) {
      this.quote.addedDate = new Date();
      this.quote.generateQuoteId();
      this._quotesService.saveQuote(this.quote);
      return;
    }

    this._quotesService.saveQuotes();
  }

  public changeEditMode() {
    this.isEditMode = !this.isEditMode;
  }
}