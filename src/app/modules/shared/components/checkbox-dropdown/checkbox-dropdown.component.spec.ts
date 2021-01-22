import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckboxDropdownComponent } from './checkbox-dropdown.component';

describe('CheckboxDropdownComponent', () => {
  let component: CheckboxDropdownComponent;
  let fixture: ComponentFixture<CheckboxDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
