// import { inject, Injectable } from '@angular/core';
// import { Firestore, collection, collectionData, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
// import { Quote } from '@entity/Quote.class';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class FirebaseService {
//   private _firestore = inject(Firestore);

//   private formatQuoteForSave(quote: Quote) {
//     const { author, author_slug, description, addedDate, categories } = quote;
//     return { author, author_slug, description, addedDate, categories };
//   }

//   public getQuotes(): Observable<Quote[]> {
//     const quotesRef = collection(this._firestore, 'quotes');
//     return collectionData(quotesRef, { idField: 'id' }) as Observable<Quote[]>;
//   }

//   public addQuote(quote: Quote) {
//     const quotesRef = collection(this._firestore, 'quotes');
//     const quoteFormatted = this.formatQuoteForSave(quote);
//     return addDoc(quotesRef, quoteFormatted);
//   }

//   public deleteQuote(id: string) {
//     const quoteDocRef = doc(this._firestore, `quotes/${id}`);
//     return deleteDoc(quoteDocRef);
//   }
// }
