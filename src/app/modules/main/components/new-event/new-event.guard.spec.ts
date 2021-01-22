import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { NewEventGuard } from './new-event.guard';

describe('NewEventGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewEventGuard]
    });
  });

  it('should ...', inject([NewEventGuard], (guard: NewEventGuard) => {
    expect(guard).toBeTruthy();
  }));
});
