import { TestBed } from '@angular/core/testing';

import { DateTransformService } from './date-transform.service';

describe('DateTransformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateTransformService = TestBed.get(DateTransformService);
    expect(service).toBeTruthy();
  });
});
