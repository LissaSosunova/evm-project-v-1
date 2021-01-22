import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToastSuccessComponent } from './toast-success.component';

describe('ToastSuccessComponent', () => {
  let component: ToastSuccessComponent;
  let fixture: ComponentFixture<ToastSuccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
