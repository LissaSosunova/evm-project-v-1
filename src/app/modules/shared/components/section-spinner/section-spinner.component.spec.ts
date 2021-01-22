import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SectionSpinnerComponent } from './section-spinner.component';

describe('SectionSpinnerComponent', () => {
  let component: SectionSpinnerComponent;
  let fixture: ComponentFixture<SectionSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
