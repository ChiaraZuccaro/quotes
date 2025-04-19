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
  }

  private saveNewQuote(quote: Quote) {
    // quote
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