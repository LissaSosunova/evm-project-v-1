import { TestBed } from '@angular/core/testing';

import { InputParamsService } from './input-params.service';

describe('InputParamsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputParamsService = TestBed.get(InputParamsService);
    expect(service).toBeTruthy();
  });
});
