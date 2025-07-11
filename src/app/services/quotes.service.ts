import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, signal, WritableSignal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { Filters } from '@interfaces/filters.interface';
import { RandomResp, QuoteResp, ListResp, ExploreListParsed } from '@interfaces/quotes-resp.interface';
import { lastValueFrom, map, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  // Warning: base uri is a configurated virtual host!
  private readonly baseUri: string = 'http://quotes.local/quote';
  // Injects
  private _http = inject(HttpClient);
  private _firestoreService = inject(FirebaseService);
  // Filters
  public initFilters: Filters = {
    typed: '', favorites: false,
    authors: [], categories: []
  };
  // Card quote
  public quoteInEditMode = signal<string>('');
  public isCreatingMode = signal(false);
  public initQuote: QuoteResp = {
    author: '', authorSlug: '',
    content: '', dateAdded: '',
    dateModified: '', length: 0,
    tags: [''], _id: ''
  };
  // List quotes
  public userQuotes: WritableSignal<Quote[]> = signal([]);
  public updateListTrigger = signal(0);
  public exploreQuotes: WritableSignal<Quote[]> = signal([]);
  public listRes = resource({
    request: () => this.updateListTrigger(),
    loader: async () => {
      const fireQuotes = await lastValueFrom(this._firestoreService.getQuotes());
      const quotes = fireQuotes.map(fireQt => Quote.createFromFirebase(fireQt));
      this.userQuotes.set(quotes);
    }
  });
  // Pagination
  public currentPage = signal(1);

  public canSaveQuote(quoteId: string): boolean {
    const indexFinded = this.userQuotes().findIndex(quote => quote.id_custom.includes(quoteId));
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

  public getListExplore(pg: number): Observable<ExploreListParsed> {
    const url = `${this.baseUri}/list`;

    const urlParams = new URLSearchParams();
    urlParams.set('page', pg.toString());

    return this._http.get<ListResp>(`${url}?${urlParams.toString()}`).pipe(map(res => {
      if(res.error || res.code !== 200) { throw new Error(res.message) }
      const { result } = res;
      return { ...result, results: result.results.map(qt => new Quote(qt)) }
    }));
  }

  public getListUser() {
    return this._firestoreService.getQuotes().pipe(
      map(res => res.map(Quote.createFromFirebase))
    );
  }
  //#endregion

  //#region user manage
  public saveQuote(quote: Quote) {
    if(this.canSaveQuote(quote.id_custom)) {
      quote.setDateSave();
      this._firestoreService.addQuote(quote);
    } else { console.warn('Quote already inserted!') }
  }

  public editQuote(quote: Quote) {
    const indexQuote = this.userQuotes().findIndex(qt => qt.id_custom === quote.id_custom);
    if(indexQuote !== -1) {
      this._firestoreService.updateQuote(quote.id_custom, quote);
    } else { throw new Error('Somehow Quote was not found!') }
  }

  public deleteQuote(quoteId: string) {
    const copyList = [ ...this.userQuotes() ];
    const indexQuote = copyList.findIndex(qt => qt.id_custom.includes(quoteId));
    if(indexQuote !== -1) {
      this._firestoreService.deleteQuote(quoteId);
    } else { throw new Error('Somehow quote was not found!') }
  }
  //#endregion
}