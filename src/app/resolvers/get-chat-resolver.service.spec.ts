import { TestBed } from '@angular/core/testing';

import { GetChatResolverService } from './get-chat-resolver.service';

describe('GetChatResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetChatResolverService = TestBed.get(GetChatResolverService);
    expect(service).toBeTruthy();
  });
});
