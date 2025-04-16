import { Component, inject, OnInit } from '@angular/core';
import { QuotesService } from '@services/quotes.service';
import { SeoService } from '@services/seo.service';
import { ListComponent } from 'src/app/ui/list/list.component';

@Component({
  selector: 'user',
  imports: [ ListComponent ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private _seoService = inject(SeoService);
  public quoteService = inject(QuotesService);

  ngOnInit(): void { this._seoService.updateMetaTag('user') }
}
