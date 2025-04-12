import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { catchError, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private readonly baseUri: string = 'https://api.quotable.io';
  private _http = inject(HttpClient);

  constructor() { }

  public getRandomQuote() {
    const url = `${this.baseUri}/quote/random`;
    
    return this._http.get(url).pipe(
      map(res => new Quote(res)),
      catchError(e => { throw new Error(e) })
    );
  }

  private getTagsList() {

  }
}
