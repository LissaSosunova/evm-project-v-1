import { TestBed } from '@angular/core/testing';

import { PopupControlsService } from './popup-controls.service';

describe('PopupControlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopupControlsService = TestBed.get(PopupControlsService);
    expect(service).toBeTruthy();
  });
});
