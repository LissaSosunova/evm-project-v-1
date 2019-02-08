import { TestBed } from '@angular/core/testing';

import { Socket.IoService } from './socket.io.service';

describe('Socket.IoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Socket.IoService = TestBed.get(Socket.IoService);
    expect(service).toBeTruthy();
  });
});
