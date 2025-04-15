import { Component, computed, inject, Input } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuoteCardComponent } from '../quote-card/quote-card.component';
import { QuotesService } from '@services/quotes.service';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'list',
  imports: [ QuoteCardComponent, FiltersComponent ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private _quotesService = inject(QuotesService);
  // TODO make list a signal!
  @Input() listQuotes: Quote[];

  public resortList = computed(() => {
    this._quotesService.updateListTrigger();
    return [...this.listQuotes].sort(
      (prevQuote, nextQuote) => Number(prevQuote.isFavorite) - Number(nextQuote.isFavorite)
    );
  })
}
