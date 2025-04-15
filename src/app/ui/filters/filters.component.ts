import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quote } from '@entity/Quote.class';
import { Filters } from '@interfaces/filters.interface';

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
export class FiltersComponent implements OnInit {
  @Input() originalList: Quote[];

  public filteredList: Quote[];
  public filters: Filters;
  public showFilters = false;

  ngOnInit(): void {
    this.filters = this.createFiltersFrom(this.originalList);
  }

  private canAdd(item: string, itemsList: string[]) {
    const findAthour= itemsList.findIndex(it => it.includes(item));
    return findAthour === -1;
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

  public filterBy(type: FiltersType) {

  }

  public openFilters() {
    this.showFilters = !this.showFilters;
  }
}
