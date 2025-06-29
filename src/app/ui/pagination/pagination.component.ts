import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationList } from '@interfaces/pagination.interface';
import { QuotesService } from '@services/quotes.service';
import { isNotValidPage } from '@utils/query-params.utils';

@Component({
  selector: 'pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {
  private readonly PAGE_TO_SHOW = 5;

  private _quoteService = inject(QuotesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  
  public allPages: number[] = [];

  public dataPage = input.required<PaginationList>();
  public pageSections: number[] = [];

  ngOnInit(): void {
    this._route.queryParams.subscribe(qp => {
      const page = qp['page'];

      if(isNotValidPage(page, this.dataPage().totalPages)) {
        const isPageMinorMin = +page < 1;
        const isPageMajorMax = +page > this.dataPage().totalPages;
        const resetPage = isPageMinorMin ? 1 : isPageMajorMax ?  this.dataPage().totalPages : 1;
        this.changePage(resetPage);
      };

      this.pageSections = this.getVisiblePages(+page);
    })
  }

  private getVisiblePages(page: number) {
    const half = Math.floor(this.PAGE_TO_SHOW / 2);
    let first = page - half;
    let last = page + half;
    
    if(first < 1) {
      last += 1 - first;
      first = 1;
    }
    
    if(last > this.dataPage().totalPages) {
      first -= 1;
      last = this.dataPage().totalPages;
    }

    const pages = [];
    for(let i = first; i <= last; i++) {
      pages.push(i);
    }
    return pages;
  }

  public changePage(newPg: number) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { page: newPg },
      queryParamsHandling: 'merge'
    });
  }

  public prev() {
    const newPage = this.dataPage().page - 1;
    if(newPage < 1) return;
    this.changePage(newPage);
  }

  public next() {
    const newPage = this.dataPage().page + 1;
    if(newPage > this.dataPage().totalPages) return;
    this.changePage(newPage);
  }
}
