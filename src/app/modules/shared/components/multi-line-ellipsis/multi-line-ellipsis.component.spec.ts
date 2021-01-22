import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiLineEllipsisComponent } from './multi-line-ellipsis.component';

describe('MultiLineEllipsisComponent', () => {
  let component: MultiLineEllipsisComponent;
  let fixture: ComponentFixture<MultiLineEllipsisComponent>;

  beforeEach(waitForAsync(() => {
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
