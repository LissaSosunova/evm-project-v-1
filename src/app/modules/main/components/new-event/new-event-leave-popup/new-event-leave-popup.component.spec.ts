import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewEventLeavePopupComponent } from './new-event-leave-popup.component';

describe('NewEventLeavePopupComponent', () => {
  let component: NewEventLeavePopupComponent;
  let fixture: ComponentFixture<NewEventLeavePopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEventLeavePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEventLeavePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
