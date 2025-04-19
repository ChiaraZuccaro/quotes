import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  private _route = inject(ActivatedRoute);
  private _quotesService = inject(QuotesService);
  private _breakpointObserver = inject(BreakpointObserver);

  private $destroy = new Subject();

  private copyList: Quote[];
  public startList = input.required<Quote[]>();
  
  public filters: Filters;
  public appliedFilters: Filters;

  public showFilters: boolean = false;
  public isExplorePage: boolean;
  public isSomeFilterApplied = false;

  public selectedAuthors: string[] = [];
  public selectedCategories: string[] = [];
  
  public openedAccordion: string[] = [];

  ngOnInit(): void {
    this._route.url.subscribe(subUrl => this.isExplorePage = subUrl.length > 0 && subUrl[0].path === 'explore');

    this._breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(res => res.matches || window.innerWidth < 600), takeUntil(this.$destroy)
    ).subscribe(isMobile => this.showFilters = !isMobile);

    this.copyList = [ ...this.startList() ];
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

    return {
      typed: '',
      favorites: false,
      authors, categories
    }
  }

  private applyFilters() {
    const { favorites: filtFav, typed: filtType, authors: filAuths, categories: filCats } = this.appliedFilters;
    const filterQuotes = this.copyList.filter(qt => {
      const matchTyped = qt.description.toLowerCase().replace(' ', '-').includes(filtType) || qt.author_slug.includes(filtType);
      const matchFav = filtFav ? qt.isFavorite : true;
      const matchAuthor = filAuths.length === 0 || filAuths.includes(qt.author);
      const matchCategory = filCats.length === 0 || qt.categories.some(cat => filCats.includes(cat));

      return matchTyped && matchFav && matchAuthor && matchCategory;
    });
    const listToSet = this.isSomeFilterApplied ? filterQuotes : this.copyList;
    this._quotesService.userQuotes.set(listToSet);
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
    switch(type) {
      case 'fav':
        this.appliedFilters.favorites = this.filters.favorites;
      break;
      case 'author':
        this.appliedFilters.authors = [...this.selectedAuthors];
      break;
      case 'typed':
        this.appliedFilters.typed = this.filters.typed.toLowerCase().replace(' ', '-');
      break;
      case 'category':
        this.appliedFilters.categories = [...this.selectedCategories];
      break;
    }
    this.isSomeFilterApplied = JSON.stringify(this.appliedFilters) !== JSON.stringify(this._quotesService.initFilters);
    this.applyFilters();
  }

  public resetFilters() {
    this.appliedFilters = structuredClone(this._quotesService.initFilters);
    this.selectedAuthors = [];
    this.selectedCategories = [];
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
