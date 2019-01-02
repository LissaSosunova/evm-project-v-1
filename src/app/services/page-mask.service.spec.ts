import { TestBed } from '@angular/core/testing';

import { PageMaskService } from './page-mask.service';

describe('PageMaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageMaskService = TestBed.get(PageMaskService);
    expect(service).toBeTruthy();
  });
});
