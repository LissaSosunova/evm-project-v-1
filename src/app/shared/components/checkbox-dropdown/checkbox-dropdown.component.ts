import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CheckboxDropdownOption } from '../../types/checkbox-dropdow';

@Component({
  selector: 'app-checkbox-dropdown',
  templateUrl: './checkbox-dropdown.component.html',
  styleUrls: ['./checkbox-dropdown.component.scss']
})
export class CheckboxDropdownComponent implements OnInit, OnChanges {

  @Input() public label: string;
  @Input() public options: CheckboxDropdownOption[];

  // do not display arrow after filter
  @Input() public hideArrow: boolean;

  // show search input above all options
  @Input() public isSearchable: boolean = true;
  
  // ids of checked options
  @Input() public checked: string[];
  @Input() public disabled: boolean = false;

  @Output() public onSelect: EventEmitter<CheckboxDropdownOption[]> = new EventEmitter<CheckboxDropdownOption[]>();
  @Output() public clickedOutside: EventEmitter<any> = new EventEmitter<any>();
  public isPanelShown: boolean = false;
  public filterQuery: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.checked && !changes.checked.isFirstChange()) {
       this.initChecked();
    }

    if (changes.options && !changes.options.isFirstChange()) {
      this.initChecked();
   }
  }

  public onSearchChange(event: string): void {
    this.filterQuery = event;
  }

  public open(event) {
    if (this.disabled) {
      return;
    }
    this.filterQuery = undefined;
    this.isPanelShown = !this.isPanelShown;
    event.stopPropagation();
  }

  public get selectedStr(): string {
    if (!this.options) {
      return 'Select';
    }
    const selectCount = this.options.reduce((prev, curr) => {
      if (curr.isChecked) {
        return prev + 1
      }
      return prev;
    }, 0);

    if (selectCount === 0) {
      return 'Select'
    } else {
      return `${selectCount} selected`;
    }
  }

  public select(option: CheckboxDropdownOption, event?: boolean) {
    setTimeout(() => {
      let optionIdsArr: CheckboxDropdownOption[] = [];
      if (option.isChecked) {
        option.isChecked = false;
      } else {
        option.isChecked = true;
      }
      optionIdsArr = this.options.filter(item => {
        return !!item.isChecked;
      });
      this.onSelect.emit(optionIdsArr);
    });

  }


  public initChecked(): void {
    if (this.options && this.checked) {
      this.options.forEach(opt => opt.isChecked = this.checked.some(c => opt.id === c));
    }
  }

  public clickOutside(): void {
    this.isPanelShown = false;
    this.clickedOutside.emit();
  }

}
