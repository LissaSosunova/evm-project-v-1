import { Component, OnInit, Input } from '@angular/core';
import { InputAbstract, MakeProvider } from '../model/input-abstract';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [MakeProvider(SelectComponent)]
})
export class SelectComponent extends InputAbstract implements OnInit {

  @Input() options: {label: string, value: string | number}[];

  constructor() {
    super();
   }

  ngOnInit() {
    super.init();
    super.subscribeFormControl();
  }

}
