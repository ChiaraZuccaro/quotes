import { Component, Input } from '@angular/core';
import { Quote } from '@entity/Quote.class';

@Component({
  selector: 'quote-card',
  imports: [],
  templateUrl: './quote-card.component.html',
  styleUrl: './quote-card.component.scss'
})
export class QuoteCardComponent {
  @Input() quote: Quote;
}
