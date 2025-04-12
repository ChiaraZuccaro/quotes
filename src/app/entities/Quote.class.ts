export class Quote {
  private description: string;
  private author: string;
  private categories: string[];
  private addedDate: string;
  private id: string;
  
  constructor(quoteResp: any) {
    const { content, author, tags, _id } = quoteResp;

    this.description= content;
    this.author = author;
    this.categories = tags;
    this.id = _id;
  }

  private generateQuoteId() {
    // TODO case creation by user
  }
}