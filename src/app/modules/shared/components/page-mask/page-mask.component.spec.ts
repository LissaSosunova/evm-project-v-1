import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMaskComponent } from './page-mask.component';

describe('PageMaskComponent', () => {
  let component: PageMaskComponent;
  let fixture: ComponentFixture<PageMaskComponent>;

  beforeEach(async(() => {
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
