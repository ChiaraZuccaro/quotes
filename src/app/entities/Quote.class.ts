import { QuoteResp } from "@interfaces/quotes-resp.interface";
import { getRandomString } from "@utils/methods";

export class Quote {
  public description: string;
  public author: string;
  public author_slug: string;
  public categories: string[];
  public addedDate: Date;
  public id: string;
  public isFavorite: boolean = false;
  public isPinned: boolean = false;
  public areSocialShown: boolean = false;
  
  constructor(quoteResp: QuoteResp) {
    const { content, author, authorSlug, tags, _id } = quoteResp;
    this.description = content;
    this.author = author;
    this.author_slug = authorSlug;
    this.categories = tags;
    this.id = _id;
  }

  public static createFakingResp(quote: Quote) {
    const fakeResp = {
      content: quote.description,
      author: quote.author,
      authorSlug: quote.author_slug,
      _id: quote.id,
      dateAdded: new Date(quote.addedDate).toISOString(),
      dateModified: new Date(quote.addedDate).toISOString(),
      length: quote.description.length,
      tags: [ ...quote.categories ]
    };
    const q = new Quote(fakeResp);
    q.addedDate = quote.addedDate;
    q.isFavorite = quote.isFavorite;
    q.isPinned = quote.isPinned;
    q.areSocialShown = quote.areSocialShown;
    return q;
  }
  
  public generateQuoteId() {
    this.id = getRandomString();
  }

  public setDateSave() {
    this.addedDate = new Date();
  }
}