import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { Filters } from '@interfaces/filters.interface';
import { RandomResp, QuoteResp, ListResp } from '@interfaces/quotes-resp.interface';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  // Warning: base uri is a configurated virtual host!
  private readonly baseUri: string = 'http://quotes.local/quote';
  // Filters
  public initFilters: Filters = {
    typed: '', favorites: false,
    authors: [], categories: []
  };
  // Card quote
  public quoteInEditMode = signal<string>('');
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
  public saveQuotes = computed(() => {
    if(this.userQuotes().length > 0) {
      // TODO this is going to be replaced by firebase
      localStorage.removeItem('user_quotes');
      localStorage.setItem('user_quotes', JSON.stringify(this.userQuotes()));
    }
  });
  // Pagination
  // ....

  constructor(
    private _http: HttpClient
  ) { this.getListUser() }

  public canSaveQuote(quoteId: string): boolean {
    const indexFinded = this.userQuotes().findIndex(quote => quote.id.includes(quoteId));
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

  public getListUser() {
    const raw = JSON.parse(localStorage.getItem('user_quotes') || '[]');
    const finalList: Quote[] = raw.map((qt: Quote) => Quote.createFakingResp(qt));
    // in user list we don't need isAlreadySaved
    finalList.forEach(qt => qt.isAlreadySaved = false);
    const qtInEdit = finalList.find(qt => qt.isEditMode);
    if(qtInEdit) this.quoteInEditMode.set(qtInEdit.id);
    this.userQuotes.set(finalList);
  }
  //#endregion

  //#region user manage
  public saveQuote(quote: Quote) {
    if(this.canSaveQuote(quote.id)) {
      const actualList = [ ...this.userQuotes() ];
      quote.setDateSave();
      actualList.push(quote);
      this.userQuotes.set(actualList);
      this.saveQuotes();
    } else { console.warn('Quote already inserted!') }
  }

  public editQuote(quote: Quote) {
    const indexQuote = this.userQuotes().findIndex(qt => qt.id === quote.id);
    if(indexQuote !== -1) {
      const copyList = [ ...this.userQuotes()];
      copyList[indexQuote] = Quote.createFakingResp(quote);
      this.userQuotes.set(copyList);
      this.saveQuotes();
    } else { throw new Error('Somehow Quote was not found!') }
  }

  public deleteQuote(quoteId: string) {
    const copyList = [ ...this.userQuotes() ];
    const indexQuote = copyList.findIndex(qt => qt.id.includes(quoteId));
    if(indexQuote !== -1) {
      copyList.splice(indexQuote, 1);
      this.userQuotes.set(copyList);
      this.saveQuotes();
    } else { console.error('Somehow quote was not found!') }
  }
  //#endregion
}
