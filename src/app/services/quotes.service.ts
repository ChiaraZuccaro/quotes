import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { GeneralResp, QuoteResp } from '@interfaces/quotes-resp.interface';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  // Warning: base uri is a configurated virtual host!
  private readonly baseUri: string = 'http://quotes.local/quote';

  public initQuote: QuoteResp = {
    author: '',
    authorSlug: '',
    content: '',
    dateAdded: '',
    dateModified: '',
    length: 0,
    tags: [''],
    _id: ''
  };
  public updateListTrigger = signal(0);
  public quotes: WritableSignal<Quote[]> = signal([]);
  public saveQuotes = computed(() => {
    if(this.quotes().length > 0) {
      // TODO this is going to be replaced by firebase
      localStorage.removeItem('user_quotes');
      localStorage.setItem('user_quotes', JSON.stringify(this.quotes()));
    }
  });

  constructor(
    private _http: HttpClient
  ) { this.quotes.set(JSON.parse(localStorage.getItem('user_quotes') || '[]')); }

  private canSaveQuote(quoteId: string): boolean {
    const indexFinded = this.quotes().findIndex(quote => quote.id.includes(quoteId));
    return indexFinded === -1;
  }

  //#region apis
  public getRandomQuote() {
    const url = `${this.baseUri}/random`;
    
    return this._http.get<GeneralResp>(url).pipe(map(res => {
      if(res.error) { throw new Error(res.message) }
      return new Quote(res.result);
    }));
  }

  private getTagsList() {

  }

  public getUserList() {
    
  }
  //#endregion

  //#region user manage
  public saveQuote(quote: Quote) {
    if(this.canSaveQuote(quote.id)) {
      const actualList = structuredClone(this.quotes());
      quote.setDateSave();
      actualList.push(quote);
      this.quotes.set(actualList);
      this.saveQuotes();
    } else { console.warn('Quote already inserted!') }
  }

  public deleteQuote(quoteId: string) {
    const copyList = structuredClone(this.quotes());
    const indexQuote = copyList.findIndex(qt => qt.id.includes(quoteId));
    if(indexQuote !== -1) {
      copyList.splice(indexQuote, 1);
      this.quotes.set(copyList);
      this.saveQuotes();
    } else { console.error('Somehow quote was not finded!') }
  }
  //#endregion
}
