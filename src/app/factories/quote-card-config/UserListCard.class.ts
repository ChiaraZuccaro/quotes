import { QuotesService } from "@services/quotes.service";
import { BaseCard } from "./BaseCard.class";
import { Quote } from "@entity/Quote.class";

export class UserListCard extends BaseCard {
  private readonly keyType = 'user_list';

  constructor(qService: QuotesService) {
    super(qService);
    this.createBaseBtns(this.keyType);
    this.setFnsBtns();
    this.hasDate = true;
    this.hasSocialEnable = true;
    this.hasPinMode = true;
    this.hasFavMode = true;
  }

  private delete(quote: Quote) {
    this._quotesService.deleteQuote(quote.id);
  }

  protected override setFnsBtns(): void {
    this.btns.forEach(bt => {
      if(bt.id === 0) { bt.clickFn = this.delete.bind(this) }
      if(bt.id === 1) { bt.clickFn = this.changeEditMode.bind(this) }
    });
  }
}