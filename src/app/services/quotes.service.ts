import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { GeneralResp, QuoteResp } from '@interfaces/quotes-resp.interface';
import { catchError, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  // Warning: base uri is a configurated virtual host!
  private readonly baseUri: string = 'http://quotes.local/quote';

  public userList: Quote[];

  constructor(
    private _http: HttpClient
  ) { this.userList = JSON.parse(localStorage.getItem('user_quotes') || '[]') }

  private canSaveQuote(quoteId: string): boolean {
    const indexFinded = this.userList.findIndex(quote => quote.id.includes(quoteId));
    return indexFinded === -1;
  }

  //#region apis
  public getRandomQuote() {
    const url = `${this.baseUri}/random`;
    
    return this._http.get<GeneralResp>(url).pipe(
      tap(res => { if(res.error) { throw new Error(res.result as string) }}),
      map(res => new Quote(res.result as QuoteResp)),
      catchError(e => { throw new Error(e) })
    );
  }

  private getTagsList() {

  }
  //#endregion

  //#region user manage
  public saveQuoteInUserList(quote: Quote) {
    if(this.canSaveQuote(quote.id)) {
      quote.setDateSave();
      this.userList.push(quote);
      localStorage.removeItem('user_quotes');
      localStorage.setItem('user_quotes', JSON.stringify(this.userList));
    } else { console.warn('Quote already inserted!') }
  }
  //#endregion
}
