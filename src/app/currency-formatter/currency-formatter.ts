import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-currency-formatter',
  templateUrl: 'currency-formatter.html'
})
export class CurrencyFormatterComponent implements OnChanges {

  @Input() numberToFormat: number;
  displayText: number;

  constructor() {
    this.displayText = 0.00;
  }

  ngOnChanges() {
    this.displayText = this.numberToFormat;
  }

}
