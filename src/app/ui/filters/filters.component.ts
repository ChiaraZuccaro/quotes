import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quote } from '@entity/Quote.class';
import { Filters } from '@interfaces/filters.interface';
import { QuotesService } from '@services/quotes.service';
import { map, Subject, takeUntil } from 'rxjs';

type FiltersType = 'fav' | 'author' | 'typed' | 'category';

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
  private _quotesService = inject(QuotesService);
  private _breakpointObserver = inject(BreakpointObserver);

  private $destroy = new Subject();

  private copyList: Quote[];
  
  public filters: Filters;
  public showFilters = false;

  public selectedAuthors: string[] = [];
  public selectedCategories: string[] = [];
  
  public openedAccordion: string[] = [];

  ngOnInit(): void {
    this._breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(res => res.matches || window.innerWidth < 600), takeUntil(this.$destroy)
    ).subscribe(isMobile => this.showFilters = !isMobile);

    this.copyList = structuredClone(this._quotesService.quotes());
    this.filters = this.createFiltersFrom(this.copyList);
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

    return {
      typed: '',
      favorites: false,
      authors, categories
    }
  }

  public manageSelection(itemToAdd: string, type: 'author' | 'category') {
    switch(type) {
      case 'author':
        if(this.canAdd(itemToAdd, this.selectedAuthors)) {
          this.selectedAuthors.push(itemToAdd);
        } else this.deleteItem(itemToAdd, this.selectedAuthors);
        this.filterBy('author');
      break;
      case 'category':
        if(this.canAdd(itemToAdd, this.selectedCategories)) {
          this.selectedCategories.push(itemToAdd);
        } else this.deleteItem(itemToAdd, this.selectedCategories);
        this.filterBy('category');
      break;
    }
  }

  public filterBy(type: FiltersType) {
    let filteredList: Quote[] = [];
    switch(type) {
      case 'fav':
        filteredList = this.filters.favorites ? this.copyList.filter(copyQuote => copyQuote.isFavorite) : this.copyList;
      break;
      case 'author':
        filteredList = this.selectedAuthors.length > 0 ? this.copyList.filter(copyQuote => this.selectedAuthors.includes(copyQuote.author)) : this.copyList;
      break;
      case 'typed':
        const normalizedTyped = this.filters.typed.toLowerCase().replace(' ', '-');
        filteredList = this.copyList.filter(copyQuote =>
          copyQuote.description.toLowerCase().replace(' ', '-').includes(normalizedTyped) ||
          copyQuote.author_slug.includes(normalizedTyped)
        );
      break;
      case 'category':
        filteredList = this.selectedCategories.length > 0 ? this.copyList.filter(
          copyQuote => copyQuote.categories.some(cat => this.selectedCategories.includes(cat))
        ) : this.copyList;
      break;
    }
    this._quotesService.quotes.set(filteredList);
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
