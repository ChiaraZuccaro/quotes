import { Component, inject, input, OnInit } from '@angular/core';
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

  public dataPage = input.required<PaginationList>();
  public allPages: number[] = [];

  ngOnInit(): void {
    this.allPages = this.createPages();
  }

  private createPages() {
    return Array.from({ length: this.dataPage().totalPages }, (_, i) => i + 1);
  }

  public changePage(newPg: number) {
    this._quoteService.currentPage.set(newPg);
  }

}
