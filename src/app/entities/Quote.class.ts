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
  
  public generateQuoteId() {
    this.id = getRandomString();
  }

  public setDateSave() {
    this.addedDate = new Date();
  }
}