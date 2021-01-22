import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatGroupsComponent } from './chat-groups.component';

describe('ChatGroupsComponent', () => {
  let component: ChatGroupsComponent;
  let fixture: ComponentFixture<ChatGroupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
