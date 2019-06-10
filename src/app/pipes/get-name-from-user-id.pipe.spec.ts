import { GetNameFromUserIDPipe } from './get-name-from-user-id.pipe';

describe('GetNameFromUserIDPipe', () => {
  it('create an instance', () => {
    const pipe = new GetNameFromUserIDPipe();
    expect(pipe).toBeTruthy();
  });
});
