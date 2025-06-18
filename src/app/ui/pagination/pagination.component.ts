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

  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;

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

  public initDrag(event: MouseEvent) {
    console.log('init drag -->', event);
    const target = event.target as HTMLElement;
    this.startX = event.pageX - target.offsetLeft;
    this.startY = event.pageY - target.offsetTop;
    this.scrollLeft = target.scrollLeft;
    this.scrollTop = target.scrollTop;
  }

  public dragging(event: MouseEvent) {
    console.log('dragging --> ', event);
    event.preventDefault();
    console.log(this.startX, this.startY);
    
    const moveX = event.pageX - this.startX;
    const moveY = event.pageY - this.startY;
    (event.currentTarget as HTMLElement).scrollLeft = this.scrollLeft - moveX;
    (event.currentTarget as HTMLElement).scrollTop = this.scrollTop - moveY;
  }

  public endDrag() {

  }
}
