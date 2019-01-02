import { TestBed } from '@angular/core/testing';

import { FormPopupService } from './form-popup.service';

describe('FormPopupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormPopupService = TestBed.get(FormPopupService);
    expect(service).toBeTruthy();
  });
});
