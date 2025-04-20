import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuoteCardComponent } from '../quote-card/quote-card.component';
import { QuotesService } from '@services/quotes.service';
import { FiltersComponent } from '../filters/filters.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'list',
  imports: [ QuoteCardComponent, FiltersComponent, RouterLink ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  private _viewportScroller = inject(ViewportScroller);
  private _breakpointObserver = inject(BreakpointObserver);
  private _route = inject(ActivatedRoute);
  public quotesService = inject(QuotesService);

  private $destroy = new Subject();

  public list = input.required<Quote[]>();

  public fixGoTop = signal(false);
  public fixFilters = signal(false);
  public isMobile = signal(false);
  public isExplorePage = false;
  public disableCard = computed(() => this.quotesService.userQuotes().some(qt => qt.isEditMode));
  public resortList = computed(() => {
    this.quotesService.updateListTrigger();
    return [...this.list()].sort(this.sortRulesList);
  });

  private checkScroll = (): void => {
    const [x, y] = this._viewportScroller.getScrollPosition();
    this.fixGoTop.set(y > 200);
    this.fixFilters.set(y > 900);
  };

  ngOnInit(): void {
    this._route.url.subscribe(
    subUrl => this.isExplorePage = subUrl.length > 0 && subUrl[0].path === 'explore');

    this._breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(res => res.matches || window.innerWidth < 600), takeUntil(this.$destroy)
    ).subscribe(isMobile => this.isMobile.set(isMobile));

    window.addEventListener('scroll', this.checkScroll);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
    window.removeEventListener('scroll', this.checkScroll);
  }

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
    // delete btn is for user list only
    // TODO Insert a modal to warn the user that this is an irreversible action
    this.quotesService.userQuotes.set([]);
    localStorage.removeItem('user_quotes');
  }

  public scrollTop() { this._viewportScroller.scrollToPosition([0,0]); }
}
