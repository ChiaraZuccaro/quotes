import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quote } from '@entity/Quote.class';
import { BaseConfig, ConfigType, ShareItem } from '@interfaces/quote-card.interface';
import { QuotesService } from '@services/quotes.service';
import { ConfigCard } from '@utils/quote-card-configs';
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

  public shareItems: ShareItem[] = [{
    copied: false,
    icon: 'icon-clipboard',
    fn: this.copyQuote.bind(this),
    name: 'copy'
  },
  {
    copied: false,
    icon: 'icon-whatsapp',
    fn: this.shareLink.bind(this),
    name: 'whatsapp'
  },
  {
    copied: false,
    icon: 'icon-facebook',
    fn: this.shareLink.bind(this),
    name: 'facebook'
  },
  {
    copied: false,
    icon: 'icon-linkedin',
    fn: this.shareLink.bind(this),
    name: 'linkedin'
  },
  {
    copied: false,
    icon: 'icon-x',
    fn: this.shareLink.bind(this),
    name: 'x'
  }];

  public isCreatingMode = computed(() => this._quotesService.isCreatingMode());
  public quote = input.required<Quote>();
  public originalType = input.required<ConfigType>();
  public config = computed<BaseConfig>(() => {
    const type = this.quote().configType?.(); // safe access
    if (!type) throw new Error('Missing quote type!');
    const configInstance = ConfigCard[type];
    if (!configInstance) throw new Error('Config not finded!');
    return new configInstance(this._quotesService).getConfig();
  });

  ngOnInit(): void {
    this.quote().configType.set(this.originalType());
    this.quote().isEditMode = this.isCreatingMode();
  }

  ngOnDestroy(): void {
    this.timeoutIds.forEach(id => clearTimeout(id));
  }

  private shareLink(index: number) {
    const shareItem = this.shareItems[index];
    const config = SHARE_SOCIAL[shareItem.name];

    if(!config) throw new Error('Missing social!');
    const origin = window.location.origin;
    let shareUrl = config.link + encodeURIComponent(origin);

    if(config.hasText) {
      shareUrl = config.link + encodeURIComponent(`${this.quote().description}\n(Author: ${this.quote().author})`);
    } else { this.copyQuote(index) }

    window.open(shareUrl, '_blank', 'width=700,height=500');
  }

  private copyQuote(index: number) {
    this.shareItems[index].copied = true;
    const formatText = `${this.quote().description}\n(Author: ${this.quote().author})`;
    navigator.clipboard.writeText(formatText).then(() => {
      this.timeoutIds.push(setTimeout(() => this.shareItems[index].copied = false, 1800));
    });
  }

  public changeFavorites() {
    this.quote().isFavorite = !this.quote().isFavorite;
    this._quotesService.saveQuotes();
  }

  public changePinned() {
    this.quote().isPinned = !this.quote().isPinned;
    this._quotesService.updateListTrigger.set(Math.random());
    this._quotesService.saveQuotes();
  }

  public showSocials() {
    this.quote().areSocialShown = !this.quote().areSocialShown;
  }

  // public saveEdit() {
  //   // if(this.quotesService.provEditField.newDescription === '') {
  //   //   this.quotesService.provEditField.newDescription = 'You need to write at least one character!';
  //   //   this.timeoutIds.push(setTimeout(() => this.quotesService.provEditField.newDescription = this.quote().description, 1500));
  //   //   return;
  //   // }
  //   // this.isEditMode = !this.isEditMode;

  //   this.quote().description = this._quotesService.provEditField.newDescription;
  //   this.quote().author = this._quotesService.provEditField.newAuthor === '' ? 'Anonymous' : this._quotesService.provEditField.newAuthor;
  //   this.quote().author_slug = this.quote().author.toLowerCase().replace(' ', '-');

  //   if(this.isCreatingMode()) {
  //     this.quote().addedDate = new Date();
  //     this.quote().generateQuoteId();
  //     this._quotesService.saveQuote(this.quote());
  //     this._quotesService.isCreatingMode.set(false);
  //     return;
  //   }
  //   this._quotesService.editQuote(this.quote());
  //   this._quotesService.saveQuotes();
  // }
}