import { Component, Input, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quote } from '@entity/Quote.class';
import { Filters } from '@interfaces/filters.interface';

type FiltersType = 'fav' | 'author' | 'typed' | 'category';

@Component({
  selector: 'filters',
  imports: [ FormsModule ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FiltersComponent implements OnInit {
  @Input() originalList: Quote[];

  public filteredList: Quote[];
  public filters: Filters;
  // filter by favorites
  // filter by categories
  // filter by typed string
  // filter by author
  public isFiltersLoading = signal(true);
  public showFilters = false;

  ngOnInit(): void {
    this.filters = this.createFiltersFrom(this.originalList);
  }

  private canAddAuthor(author: string, authorList: string[]): boolean {
    const findAthour= authorList.findIndex(authL => authL.includes(author));
    return findAthour === -1;
  }

  private canAddCategory(cat: string, categoriesList: string[]): boolean {
    const findCategory = categoriesList.findIndex(catL => catL.includes(cat));
    return findCategory === -1;
  }

  private createFiltersFrom(list: Quote[]): Filters {
    const authors: string[] = [];
    const categories: string[] = [];

    list.forEach(quote => {
      if(this.canAddAuthor(quote.author_slug, authors)) {
        authors.push(quote.author);
      }
      quote.categories.forEach(category => {
        if(this.canAddCategory(category, categories)) {
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

  public filterBy(type: FiltersType) {

  }

  public openFilters() {
    this.showFilters = !this.showFilters;
  }
}
