import { QuotesService } from "@services/quotes.service";
import { BaseCard } from "./BaseCard.class";
import { Quote } from "@entity/Quote.class";

export class EditCard extends BaseCard {
  private readonly keyType = 'edit';

  constructor(qService: QuotesService) {
    super(qService);
    this.createBaseBtns(this.keyType);
    this.setFnsBtns();
    this.hasDate = false;
    this.hasSocialEnable = false;
    this.hasPinMode = false;
    this.hasFavMode = false;
  }

  private saveEdit(quote: Quote) {
    if(this.canProceed(quote)) {
      quote.description = quote.editFields.newDescription;
      quote.author = quote.editFields.newAuthor === '' ? 'Anonymous' : quote.editFields.newAuthor;
      quote.author_slug = quote.author.toLowerCase().replace(' ', '-');
      quote.isEditMode = false;
      this._quotesService.editQuote(quote);
    }
  }

  protected override setFnsBtns(): void {
    this.btns.forEach(bt => {
      if(bt.id === 2) { bt.clickFn = this.saveEdit.bind(this) }
      if(bt.id === 3) { bt.clickFn = this.changeEditMode.bind(this) }
    });
  }
}