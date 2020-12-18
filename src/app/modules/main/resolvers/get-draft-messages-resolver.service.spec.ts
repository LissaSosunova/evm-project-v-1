import { TestBed } from '@angular/core/testing';

import { GetDraftMessagesResolverService } from './get-draft-messages-resolver.service';

describe('GetDraftMessagesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetDraftMessagesResolverService = TestBed.get(GetDraftMessagesResolverService);
    expect(service).toBeTruthy();
  });
});
