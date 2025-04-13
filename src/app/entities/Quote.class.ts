import { QuoteResp } from "@interfaces/quotes-resp.interface";

export class Quote {
  public description: string;
  public author: string;
  public author_slug: string;
  public categories: string[];
  public addedDate: string;
  public id: string;
  
  constructor(quoteResp: QuoteResp[]) {
    const { content, author, tags, _id } = quoteResp[0];
    this.description = content;
    this.author = author;
    this.categories = tags;
    this.id = _id;
  }

  private generateQuoteId() {
    // TODO case creation by user
  }
}