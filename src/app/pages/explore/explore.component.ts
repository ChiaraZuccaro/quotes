import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quote } from '@entity/Quote.class';
import { PaginationList } from '@interfaces/pagination.interface';
import { ExploreListParsed } from '@interfaces/quotes-resp.interface';
import { QuotesService } from '@services/quotes.service';
import { SeoService } from '@services/seo.service';
import { ListComponent } from '@ui/list/list.component';
import { PaginationComponent } from '@ui/pagination/pagination.component';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'explore',
  imports: [ ListComponent, PaginationComponent ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _seoService = inject(SeoService);
  public quotesService = inject(QuotesService);

  public isLoading = signal(true);
  public paginator: PaginationList = { totalPages: 0, page: 0 };

  ngOnInit() {
    this._seoService.updateMetaTag('explore');

    this._route.queryParams.subscribe(qp => {
      const pg = qp['page'];

      this.isLoading.set(true);
      this.quotesService.getListExplore(pg).pipe(
        catchError(err =>  throwError(() => err)),
        finalize(() => this.isLoading.set(false))
      ).subscribe({
        next: res => { this.setPaginationInfo(res); this.setList(res.results); },
        error: err => console.error(err)
      });
    })
  }

  private checkSavedQuotes(list: Quote[]) {
    const copyList = [...list];
    copyList.forEach(qt => {
      qt.isAlreadySaved = !this.quotesService.canSaveQuote(qt.id_custom);
      if(qt.isAlreadySaved) {
        const findQt = this.quotesService.userQuotes().find(usQt => usQt.id_custom === qt.id_custom);
        if(findQt) { qt.addedDate = findQt.addedDate; qt.isFavorite = findQt.isFavorite }
      }
    });
    return copyList;
  }

  private setList(listRes: Quote[]) {
    const checkedList = this.checkSavedQuotes(listRes);
    this.quotesService.exploreQuotes.set(checkedList);
  }

  private setPaginationInfo(res: ExploreListParsed) {
    this.paginator = { totalPages: res.totalPages, page: res.page };
  }
}
