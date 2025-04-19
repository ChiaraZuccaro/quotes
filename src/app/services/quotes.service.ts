import { HttpClient } from '@angular/common/http';
import { computed, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { RandomResp, QuoteResp, ListResp } from '@interfaces/quotes-resp.interface';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  // Warning: base uri is a configurated virtual host!
  private readonly baseUri: string = 'http://quotes.local/quote';
  // Card quote
  public isCreatingMode = signal(false);
  public updateListTrigger = signal(0);
  public initQuote: QuoteResp = {
    author: '', authorSlug: '',
    content: '', dateAdded: '',
    dateModified: '', length: 0,
    tags: [''], _id: ''
  };
  // List quotes
  public userQuotes: WritableSignal<Quote[]> = signal([]);
  public exploreQuotes: WritableSignal<Quote[]> = signal([]);
  public quotes = linkedSignal(() => {
    const userQs = this.userQuotes();
    const exploreQs = this.exploreQuotes();

    if(userQs.length > 0) { return userQs; }
    if(exploreQs.length > 0) { return exploreQs; }
    return [];
  });
  public saveQuotes = computed(() => {
    if(this.quotes().length > 0) {
      // TODO this is going to be replaced by firebase
      localStorage.removeItem('user_quotes');
      localStorage.setItem('user_quotes', JSON.stringify(this.quotes()));
    }
  });

  constructor(
    private _http: HttpClient
  ) { const raw = JSON.parse(localStorage.getItem('user_quotes') || '[]');
  this.userQuotes.set(raw.map((qt: Quote) => Quote.createFakingResp(qt)));}

  private canSaveQuote(quoteId: string): boolean {
    const indexFinded = this.quotes().findIndex(quote => quote.id.includes(quoteId));
    return indexFinded === -1;
  }

  //#region apis
  public getRandomQuote() {
    const url = `${this.baseUri}/random`;
    
    return this._http.get<RandomResp>(url).pipe(map(res => {
      if(res.error) { throw new Error(res.message) }
      return new Quote(res.result[0]);
    }));
  }

  public getListExplore() {
    const url = `${this.baseUri}/list`;

    return this._http.get<ListResp>(url).pipe(map(res => {
      if(res.error) { throw new Error(res.message) }
      return res.result.results.map(qt => new Quote(qt));
    }));
  }
  //#endregion

  //#region user manage
  public saveQuote(quote: Quote) {
    if(this.canSaveQuote(quote.id)) {
      const actualList = structuredClone(this.quotes());
      quote.setDateSave();
      actualList.push(quote);
      this.userQuotes.set(actualList);
      this.saveQuotes();
    } else { console.warn('Quote already inserted!') }
  }

  public editQuote(quote: Quote) {
    const indexQuote = this.quotes().findIndex(qt => qt.id === quote.id);
    if(indexQuote !== -1) {
      const copyList = structuredClone(this.quotes());
      copyList[indexQuote] = quote;
      this.userQuotes.set(copyList);
    } else { throw new Error('Somehow Quote was not found!') }
  }

  public deleteQuote(quoteId: string) {
    const copyList = structuredClone(this.quotes());
    const indexQuote = copyList.findIndex(qt => qt.id.includes(quoteId));
    if(indexQuote !== -1) {
      copyList.splice(indexQuote, 1);
      this.userQuotes.set(copyList);
      this.saveQuotes();
    } else { console.error('Somehow quote was not found!') }
  }
  //#endregion
}
