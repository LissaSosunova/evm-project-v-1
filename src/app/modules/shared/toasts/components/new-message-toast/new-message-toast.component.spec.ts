import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewMessageToastComponent } from './new-message-toast.component';

describe('NewMessageToastComponent', () => {
  let component: NewMessageToastComponent;
  let fixture: ComponentFixture<NewMessageToastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMessageToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMessageToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
