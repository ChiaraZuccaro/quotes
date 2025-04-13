import { Component, Input } from '@angular/core';
import { Quote } from '@entity/Quote.class';
import { QuoteCardComponent } from '../quote-card/quote-card.component';

@Component({
  selector: 'list',
  imports: [ QuoteCardComponent ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() listQuotes: Quote[];
}
