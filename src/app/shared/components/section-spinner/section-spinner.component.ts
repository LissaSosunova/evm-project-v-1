import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-section-spinner',
  templateUrl: './section-spinner.component.html',
  styleUrls: ['./section-spinner.component.scss']
})
export class SectionSpinnerComponent implements OnInit {

  @Input() public loading: boolean;
  @Input() public position = 'fixed';
  @Input() public width = '50px';
  @Input() public diameter: string;

  constructor() { }

  ngOnInit() {
  }

}
