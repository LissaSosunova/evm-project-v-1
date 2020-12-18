import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatInfoPopupComponent } from './group-chat-info-popup.component';

describe('NewGroupChatPopupComponent', () => {
  let component: GroupChatInfoPopupComponent;
  let fixture: ComponentFixture<GroupChatInfoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatInfoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
