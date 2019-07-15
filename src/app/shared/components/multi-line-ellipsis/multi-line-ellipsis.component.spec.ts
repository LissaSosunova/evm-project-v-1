import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLineEllipsisComponent } from './multi-line-ellipsis.component';

describe('MultiLineEllipsisComponent', () => {
  let component: MultiLineEllipsisComponent;
  let fixture: ComponentFixture<MultiLineEllipsisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiLineEllipsisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLineEllipsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
