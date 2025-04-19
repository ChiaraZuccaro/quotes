import { QuotesService } from "@services/quotes.service";
import { BaseCard } from "./BaseCard.class";
import { Quote } from "@entity/Quote.class";

export class CreationCard extends BaseCard {
  private readonly keyType = 'creation';

  constructor(qService: QuotesService) {
    super(qService);
    this.createBaseBtns(this.keyType);
    this.setFnsBtns();
    this.hasDate = false;
    this.hasSocialEnable = false;
    this.hasPinMode = false;
    this.hasFavMode = false;
  }

  private resetNewQuote(quote: Quote) {
    quote.description = '';
    quote.author = '';
    quote.author_slug = '';
    quote.isEditMode = true;
    quote.id = '';
    quote.editFields = { newDescription: '', newAuthor: '' };
  }

  private saveNewQuote(quote: Quote) {
    if(this.canProceed(quote)) {
      quote.description = quote.editFields.newDescription;
      quote.author = quote.editFields.newAuthor === '' ? 'Anonymous' : quote.editFields.newAuthor;
      quote.author_slug = quote.author.toLowerCase().replace(' ', '-');
      quote.addedDate = new Date();
      quote.generateQuoteId();
      quote.isEditMode = false;
      const qtSave = Quote.createFakingResp(quote);
      this._quotesService.saveQuote(qtSave);
      this.resetNewQuote(quote);
      this.closeCreateMode();
    }
  }

  private closeCreateMode() {
    this._quotesService.isCreatingMode.set(false);
  }

  protected override setFnsBtns(): void {
    this.btns.forEach(bt => {
      if(bt.id === 2) { bt.clickFn =  this.saveNewQuote.bind(this) }
      if(bt.id === 3) { bt.clickFn =  this.closeCreateMode.bind(this) }
    });
  }
}