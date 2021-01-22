import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageMaskComponent } from './page-mask.component';

describe('PageMaskComponent', () => {
  let component: PageMaskComponent;
  let fixture: ComponentFixture<PageMaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
