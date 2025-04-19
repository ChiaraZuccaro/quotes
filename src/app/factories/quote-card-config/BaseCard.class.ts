import { Quote } from "@entity/Quote.class";
import { BaseBtn, BaseConfig, Btns, ConfigType } from "@interfaces/quote-card.interface";
import { QuotesService } from "@services/quotes.service";

export abstract class BaseCard {
  // init fns btns
  protected fnsMap: Record<ConfigType, Record<number, (quote: Quote) => void>> = {
    creation: { 2: () => {}, 3: () => {} },
    edit: { 2: () => {}, 3: () => {} },
    user_list: { 0: () => {}, 1: () => {} },
    explore_list: { 2: () => {} }
  };

  protected _quotesService: QuotesService;
  // all btns
  protected baseBtns: BaseBtn[] = [
    { icon: 'icon-trash', id: 0 }, { icon: 'icon-edit-pencil', id: 1 },
    { icon: 'icon-close', id: 3 }, { icon: 'icon-save-disk', id: 2 }
  ];

  public hasSocialEnable: boolean;
  public hasDate: boolean;
  public hasPinMode: boolean;
  public hasFavMode: boolean;
  public btns: Btns[];

  constructor(qService: QuotesService) { this._quotesService = qService }

  protected abstract setFnsBtns(): void;

  protected createBaseBtns(key: ConfigType) {
    const btnsByKey = this.fnsMap[key];
    const filterBtns = this.baseBtns.filter(baseBt => btnsByKey[baseBt.id]);
    this.btns = filterBtns.map(bt => ({ ...bt, clickFn: btnsByKey[bt.id] }));
  }

  protected canProceed(quote: Quote) {
    if(quote.editFields.newDescription === '') {
      quote.editFields.newDescription = 'You need to write at least one character!';
      setTimeout(() => quote.editFields.newDescription = quote.description, 1500);
      // this.timeoutIds.push(setTimeout(() => this._quotesService.provEditField.newDescription = quote.description, 1500));
      return false;
    }
    return true;
  }

  protected changeEditMode(quote: Quote) {
    const activeEdit = quote.isEditMode ? '' : quote.id;
    quote.isEditMode = !quote.isEditMode;

    this._quotesService.editQuote(quote); // to save editMode property
    this._quotesService.quoteInEditMode.set(activeEdit);
    quote.configType.set(quote.isEditMode ? 'edit' : 'user_list');
  }

  public getConfig(): BaseConfig {
    return {
      hasDate: this.hasDate,
      hasSocialEnable: this.hasSocialEnable,
      hasPinMode: this.hasPinMode,
      hasFavMode: this.hasFavMode,
      btns: this.btns
    }
  }
}
