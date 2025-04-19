import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuotesService } from '@services/quotes.service';
import { catchError, finalize, throwError } from 'rxjs';
import { ListComponent } from 'src/app/ui/list/list.component';

@Component({
  selector: 'explore',
  imports: [ ListComponent, RouterLink ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit {
  public quotesService = inject(QuotesService);

  public isLoading = signal(true);

  ngOnInit(): void {
    this.quotesService.userQuotes.set([]);
    this.quotesService.getListExplore().pipe(
      catchError(err =>  throwError(() => err)),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: list => this.quotesService.exploreQuotes.set(list),
      error: err => console.error(err)
    });
  }
}
