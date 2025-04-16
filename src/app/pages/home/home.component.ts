import { Component, inject, OnInit } from '@angular/core';
import { QuotesService } from '@services/quotes.service';
import { SeoService } from '@services/seo.service';
import { UserComponent } from '../user/user.component';
import { RandomQuoteComponent } from 'src/app/ui/random-quote/random-quote.component';
import { CreateNewComponent } from 'src/app/ui/create-new/create-new.component';

@Component({
  selector: 'home',
  imports: [ UserComponent, RandomQuoteComponent, CreateNewComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _quoteService = inject(QuotesService);

  ngOnInit(): void {
    this._seoService.updateMetaTag('home');
  }
}
