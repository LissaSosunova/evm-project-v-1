import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastFailComponent } from './toast-fail.component';

describe('ToastFailComponent', () => {
  let component: ToastFailComponent;
  let fixture: ComponentFixture<ToastFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastFailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
