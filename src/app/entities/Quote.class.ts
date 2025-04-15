import { QuoteResp } from "@interfaces/quotes-resp.interface";

export class Quote {
  public description: string;
  public author: string;
  public author_slug: string;
  public categories: string[];
  public addedDate: string;
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
  
  private formatDate() {
    const date = new Date();
    // day
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    // hour
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  }

  private generateQuoteId() {
    // TODO case creation by user
  }

  public setDateSave() {
    this.addedDate = this.formatDate();
  }
}