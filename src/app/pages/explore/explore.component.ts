import { Component, inject, OnInit, signal } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuotesService } from '@services/quotes.service';
import { catchError, finalize, throwError } from 'rxjs';
import { ListComponent } from 'src/app/ui/list/list.component';
import { PaginationComponent } from 'src/app/ui/pagination/pagination.component';

@Component({
  selector: 'explore',
  imports: [ ListComponent, PaginationComponent ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit {
  public quotesService = inject(QuotesService);

  public isLoading = signal(true);

  ngOnInit(): void {
    this.quotesService.getListExplore().pipe(
      catchError(err =>  throwError(() => err)),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: list => this.quotesService.exploreQuotes.set(this.checkSavedQuotes(list)),
      error: err => console.error(err)
    });
  }

  private checkSavedQuotes(list: Quote[]) {
    const copyList = [...list];
    copyList.forEach(qt => {
      qt.isAlreadySaved = !this.quotesService.canSaveQuote(qt.id);
      if(qt.isAlreadySaved) {
        const findQt = this.quotesService.userQuotes().find(usQt => usQt.id === qt.id);
        if(findQt) { qt.addedDate = findQt.addedDate; qt.isFavorite = findQt.isFavorite }
      }
    });
    return copyList;
  }
}
