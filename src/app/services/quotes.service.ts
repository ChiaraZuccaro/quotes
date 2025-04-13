import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { GeneralResp, QuoteResp } from '@interfaces/quotes-resp.interface';
import { catchError, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  // Warning: base uri is configurated virtual host!
  private readonly baseUri: string = 'http://quotes.local/quote';
  private _http = inject(HttpClient);

  public getRandomQuote() {
    const url = `${this.baseUri}/random`;
    
    return this._http.get<GeneralResp>(url).pipe(
      tap(res => { if(res.error) { throw new Error(res.result as string) }}),
      map(res => new Quote(res.result as QuoteResp[])),
      catchError(e => { throw new Error(e) })
    );
  }

  private getTagsList() {

  }
}
