import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageTextComponent } from './message-text.component';

describe('MessageTextComponent', () => {
  let component: MessageTextComponent;
  let fixture: ComponentFixture<MessageTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
