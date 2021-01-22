import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrMsgComponent } from './err-msg.component';

describe('ErrMsgComponent', () => {
  let component: ErrMsgComponent;
  let fixture: ComponentFixture<ErrMsgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
