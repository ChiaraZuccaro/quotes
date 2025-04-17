import { Component, computed, inject } from '@angular/core';
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

  public resortList = computed(() => {
    this._quotesService.updateListTrigger();
    return [...this._quotesService.quotes()].sort(this.sortRulesList);
  });

  private sortRulesList(prevQuote: Quote, nextQuote: Quote) {
    // primary priority sort (by Pin property)
    if(prevQuote.isPinned && !nextQuote.isPinned) return -1;
    if(!prevQuote.isPinned && nextQuote.isPinned) return 1;
    // secondary priority sort (by Date)
    const nextDate = new Date(nextQuote.addedDate).getTime();
    const prevDate = new Date(prevQuote.addedDate).getTime();
    return nextDate - prevDate;
  }

  public deleteAllQuotes() {
    // TODO Insert a modal to warn the user that this is an irreversible action
    this._quotesService.quotes.set([]);
  }
}
