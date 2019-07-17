import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLineInputComponent } from './multi-line-input.component';

describe('MultiLineInputComponent', () => {
  let component: MultiLineInputComponent;
  let fixture: ComponentFixture<MultiLineInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiLineInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLineInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
