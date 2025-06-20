import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationList } from '@interfaces/pagination.interface';
import { QuotesService } from '@services/quotes.service';

@Component({
  selector: 'pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {
  private _quoteService = inject(QuotesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  public allPages: number[] = [];

  public dataPage = input.required<PaginationList>();
  public pageSections: number[] = [];

  ngOnInit(): void {
    this.allPages = this.createPages();
    this.pageSections = this.firstSection();

    this._route.queryParams.subscribe(qp => {
      const pg = qp['page'];
    })
  }

  private advanceSection() {}

  private firstSection() {
    const test = Array.from({ length: 5 }, (_, i) => i + 1);

    return test;
  }

  private createPages() {
    return Array.from({ length: this.dataPage().totalPages }, (_, i) => i + 1);
  }

  public changePage(newPg: number) {
    this._quoteService.currentPage.set(newPg);
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { page: newPg },
      queryParamsHandling: 'merge'
    });
  }
}
