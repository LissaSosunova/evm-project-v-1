import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateAndTimePickerComponent } from './input-date-and-time-picker.component';

describe('InputDateAndTimePickerComponent', () => {
  let component: InputDateAndTimePickerComponent;
  let fixture: ComponentFixture<InputDateAndTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDateAndTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDateAndTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
