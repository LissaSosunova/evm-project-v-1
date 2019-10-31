import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGroupChatPopupComponent } from './new-group-chat-popup.component';

describe('NewGroupChatPopupComponent', () => {
  let component: NewGroupChatPopupComponent;
  let fixture: ComponentFixture<NewGroupChatPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGroupChatPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupChatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
