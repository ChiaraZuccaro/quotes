import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Quote } from '@entity/Quote.class';
import { FireResp } from '@interfaces/firebase.interface';
import { setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _firestore = inject(Firestore);

  private formatQuoteForSave(quote: Quote) {
    const { author, author_slug, description, addedDate, categories, isFavorite, isPinned } = quote;
    return { author, author_slug, description, addedDate, categories, isFavorite, isPinned };
  }

  public getQuotes(): Observable<FireResp[]> {
    const quotesRef = collection(this._firestore, 'quotes');
    return collectionData(quotesRef, { idField: 'id' }) as Observable<FireResp[]>;
  }

  public addQuote(quote: Quote) {
    const quotesRef = collection(this._firestore, 'quotes');
    const quoteFormatted = this.formatQuoteForSave(quote);
    return addDoc(quotesRef, quoteFormatted);
  }

  public updateQuote(quoteId: string, updatedData: Quote) {
    const quoteRef = doc(this._firestore, 'quotes', quoteId);
    const quoteFormatted = this.formatQuoteForSave(updatedData);
    return setDoc(quoteRef, quoteFormatted, { merge: true });
  }

  public deleteQuote(id: string) {
    const quoteDocRef = doc(this._firestore, `quotes/${id}`);
    return deleteDoc(quoteDocRef);
  }
}
