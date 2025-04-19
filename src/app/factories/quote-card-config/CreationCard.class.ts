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

  private saveNewQuote(quote: Quote) {
    // if(this.canProceed(quote)) {
      // quote.description = this._quotesService.provEditField.newDescription;
      // quote.author = this._quotesService.provEditField.newAuthor === '' ? 'Anonymous' : this._quotesService.provEditField.newAuthor;
      // quote.author_slug = quote.author.toLowerCase().replace(' ', '-');
      // quote.addedDate = new Date();
      // quote.generateQuoteId();
      // quote.isEditMode = false;
      // this._quotesService.saveQuote(quote);
      // this.closeCreateMode();
    // }
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