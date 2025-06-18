import { signal, WritableSignal } from "@angular/core";
import { FireResp } from "@interfaces/firebase.interface";
import { ConfigType, EditFields } from "@interfaces/quote-card.interface";
import { QuoteResp } from "@interfaces/quotes-resp.interface";
import { getRandomString } from "@utils/methods";

export class Quote {
  // Data
  public description: string;
  public author: string;
  public author_slug: string;
  public categories: string[];
  public addedDate: Date;
  public id_custom: string;
  // View manage
  public isFavorite: boolean = false;
  public isPinned: boolean = false;
  public areSocialShown: boolean = false;
  public isEditMode: boolean = false;
  public isAlreadySaved: boolean = false;
  public editFields: EditFields = { newDescription: '', newAuthor: '' };
  public configType: WritableSignal<ConfigType> = signal('user_list');
  
  constructor(quoteResp: QuoteResp) {
    const { content, author, authorSlug, tags, _id } = quoteResp;
    this.description = content;
    this.author = author;
    this.author_slug = authorSlug;
    this.categories = tags;
    this.id_custom = _id;
    this.editFields.newAuthor = author;
    this.editFields.newDescription = content;
  }

  public static createFakingResp(quote: Quote) {
    const fakeResp = {
      content: quote.description,
      author: quote.author,
      authorSlug: quote.author_slug,
      _id: quote.id_custom,
      dateAdded: new Date(quote.addedDate).toISOString(),
      dateModified: new Date(quote.addedDate).toISOString(),
      length: quote.description.length,
      tags: [ ...quote.categories ]
    };
    const q = new Quote(fakeResp);
    q.addedDate = quote.addedDate;
    q.isEditMode = quote.isEditMode;
    q.isFavorite = quote.isFavorite;
    q.isPinned = quote.isPinned;
    q.areSocialShown = quote.areSocialShown;
    q.configType.set(q.isEditMode ? 'edit' : 'user_list');
    return q;
  }

  public static createFromFirebase(quote: FireResp) {
    const fakeResp = {
      content: quote.description,
      author: quote.author,
      authorSlug: quote.author_slug,
      _id: quote.id,
      dateAdded: quote.addedDate.toDate().toISOString(),
      dateModified: quote.addedDate.toDate().toISOString(),
      length: quote.description.length,
      tags: [ ...quote.categories ]
    };

    const q = new Quote(fakeResp);
    q.addedDate = quote.addedDate.toDate();
    q.isEditMode = false;
    q.isFavorite = quote.isFavorite;
    q.isPinned = quote.isPinned;
    q.areSocialShown = false;
    q.configType.set('user_list');
    return q;
  }
  
  public generateQuoteId() {
    this.id_custom = getRandomString();
  }

  public setDateSave() {
    this.addedDate = new Date();
  }
}