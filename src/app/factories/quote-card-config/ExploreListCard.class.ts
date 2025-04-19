import { QuotesService } from "@services/quotes.service";
import { BaseCard } from "./BaseCard.class";
import { Quote } from "@entity/Quote.class";

export class ExploreListCard extends BaseCard {
  private readonly keyType = 'explore_list';

  constructor(qService: QuotesService) {
    super(qService);
    this.createBaseBtns(this.keyType);
    this.setFnsBtns();
    this.hasDate = false;
    this.hasSocialEnable = true;
  }

  private saveExploredQuote(quote: Quote) {
    this._quotesService.saveQuote(quote);
  }

  protected override setFnsBtns(): void {
    this.btns.forEach(bt => {
      if(bt.id === 2) { bt.clickFn = this.saveExploredQuote.bind(this) }
    });
  }
}