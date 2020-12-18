import { TestBed } from '@angular/core/testing';

import { GetDataUserResolverService } from './get-data-user-resolver.service';

describe('GetDataUserResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetDataUserResolverService = TestBed.get(GetDataUserResolverService);
    expect(service).toBeTruthy();
  });
});
