import { Component, inject, OnInit } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuotesService } from '@services/quotes.service';
import { SeoService } from '@services/seo.service';
import { ListComponent } from 'src/app/ui/list/list.component';

@Component({
  selector: 'user',
  imports: [ ListComponent ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _quoteService = inject(QuotesService);

  public list: Quote[];

  ngOnInit(): void {
    this._seoService.updateMetaTag('user');
    this.list = JSON.parse(localStorage.getItem('user_quotes') || '[]');
  }

  public newQuote() {
    // TODO open modal and then save
    // this._quotesService.saveQuoteInUserList();
  }
}
