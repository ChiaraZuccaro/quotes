import { Component, inject, OnInit } from '@angular/core';
import { QuotesService } from '@services/quotes.service';
import { SeoService } from '@services/seo.service';
import { RandomQuoteComponent } from 'src/app/ui/random-quote/random-quote.component';
import { ListComponent } from 'src/app/ui/list/list.component';
import { CtasComponent } from 'src/app/ui/ctas/ctas.component';

@Component({
  selector: 'home',
  imports: [ CtasComponent, RandomQuoteComponent, ListComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  public quoteService = inject(QuotesService);

  ngOnInit(): void { this._seoService.updateMetaTag('home') }
}
