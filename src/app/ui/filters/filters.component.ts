import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Quote } from '@entity/Quote.class';
import { Filters } from '@interfaces/filters.interface';
import { QuotesService } from '@services/quotes.service';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'filters',
  imports: [ FormsModule ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
// filter by favorites
// filter by categories
// filter by typed string
// filter by author
export class FiltersComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _quotesService = inject(QuotesService);
  private _breakpointObserver = inject(BreakpointObserver);

  private $destroy = new Subject();

  private copyList: Quote[];
  // this list is going to be filtered
  public startList = input.required<Quote[]>();
  
  public filters: Filters;
  public appliedFilters: Filters;

  public showFilters: boolean = false;
  public isExplorePage: boolean;
  public isSomeFilterApplied = false;
  
  public openedAccordion: string[] = [];

  ngOnInit(): void {
    this._route.url.subscribe(subUrl => this.isExplorePage = subUrl.length > 0 && subUrl[0].path === 'explore');

    this._breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(res => res.matches || window.innerWidth < 600), takeUntil(this.$destroy)
    ).subscribe(isMobile => this.showFilters = !isMobile);

    this.copyList = [ ...this.startList() ];
    // TODO to enhance
    this.filters = this.createFiltersFrom(this.copyList);
    this.appliedFilters = structuredClone(this._quotesService.initFilters);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  private canAdd(item: string, itemsList: string[]) {
    const indexFinded = itemsList.findIndex(it => it.includes(item));
    return indexFinded === -1;
  }

  private deleteItem(item: string, itemsList: string[]) {
    const indexFinded = itemsList.findIndex(it => it.includes(item));
    if(indexFinded !== -1) {
      itemsList.splice(indexFinded, 1);
    }
  }

  private createFiltersFrom(list: Quote[]): Filters {
    const authors: string[] = [];
    const categories: string[] = [];

    list.forEach(quote => {
      if(this.canAdd(quote.author, authors)) {
        authors.push(quote.author);
      }
      quote.categories.forEach(category => {
        if(this.canAdd(category, categories)) {
          categories.push(category);
        }
      })
    });

    authors.sort((a, b) => a.localeCompare(b));
    categories.sort((a, b) => a.localeCompare(b));

    return {
      typed: '',
      favorites: false,
      authors, categories
    }
  }

  private createKeywords() {
    return this.appliedFilters.typed.split(/\s+/).filter(k => k.length > 0);
  }

  private matchesTyped(qt: Quote): boolean {
    const typed = this.appliedFilters.typed;
    if (typed.length === 0) return true;
  
    const keywords = this.createKeywords();
    return keywords.some(kw => qt.description.toLowerCase().includes(kw) ||
      qt.author_slug.includes(kw)
    );
  }
  
  private matchesFavorite(qt: Quote): boolean {
    return this.appliedFilters.favorites ? qt.isFavorite : true;
  }
  
  private matchesAuthor(qt: Quote): boolean {
    const authors = this.appliedFilters.authors;
    return authors.length === 0 || authors.includes(qt.author);
  }
  
  private matchesCategory(qt: Quote): boolean {
    const categories = this.appliedFilters.categories;
    return categories.length === 0 || qt.categories.some(cat => categories.includes(cat));
  }
  

  public applyFilters() {
    this.isSomeFilterApplied = JSON.stringify(this.appliedFilters) !== JSON.stringify(this._quotesService.initFilters);
    const filterQuotes = this.copyList.filter(qt => this.matchesTyped(qt) &&
      this.matchesFavorite(qt) && this.matchesAuthor(qt) && this.matchesCategory(qt)
    );
    const listToSet = this.isSomeFilterApplied ? filterQuotes : this.copyList;
    this._quotesService.userQuotes.set(listToSet);
  }

  public manageSelection(itemToAdd: string, type: keyof Filters) {
    // I'm sure that is going to be a string array because type var is only 'authors' or 'categories'
    const arraySelection = this.appliedFilters[type] as string[];

    if(this.canAdd(itemToAdd, arraySelection)) {
      arraySelection.push(itemToAdd);
    } else this.deleteItem(itemToAdd, arraySelection);
    // sort by alphabetic order after push
    arraySelection.sort((a, b) => a.localeCompare(b));

    const allItemsAreSelected = (this.filters[type] as string[]).every(selItem => arraySelection.includes(selItem));
    if(allItemsAreSelected) { this.resetFilters(); return; }

    // INSTEAD OF ...
    // switch(type) {
    //   case 'author':
    //     if(this.canAdd(itemToAdd, this.appliedFilters.authors)) {
    //       this.appliedFilters.authors.push(itemToAdd);
    //     } else this.deleteItem(itemToAdd, this.appliedFilters.authors);
    //   break;
    //   case 'category':
    //     if(this.canAdd(itemToAdd, this.appliedFilters.categories)) {
    //       this.appliedFilters.categories.push(itemToAdd);
    //     } else this.deleteItem(itemToAdd, this.appliedFilters.categories);
    //   break;
    // }
    
    this.applyFilters();
  }

  public resetFilters() {
    this.appliedFilters = structuredClone(this._quotesService.initFilters);
    this.openedAccordion = [];
    this.isSomeFilterApplied = false;
    this._quotesService.userQuotes.set(this.copyList);
  }

  public openFilters() {
    this.showFilters = !this.showFilters;
    this.openedAccordion = [];
  }

  public manageAccordion(key: 'author' | 'category') {
    if(this.openedAccordion.length === 0) {
      this.openedAccordion.push(key);
      return;
    }

    const findedKey = this.openedAccordion.findIndex(acc => acc.includes(key));
    this.openedAccordion = [];
    if(findedKey === -1) { this.openedAccordion.push(key); }
  }
}
