import { warning } from '../../src/utils/warning';

describe('warning', () => {
  beforeEach(() => {
    if (warning.mockRestore) {
      warning.mockRestore();
    }
  });

  it('defaults to warning', () => {
    warning('uh oh', 'key');

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn.mock.calls[0][0]).toEqual('uh oh');
  });

  it('should log one time for duplicate calls', () => {
    warning('uh oh', 'key');
    warning('uh oh', 'key');

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn.mock.calls[0][0]).toEqual('uh oh');
  });

  it('should log using error when specified', () => {
    warning('beep', 'key', 'error');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toEqual('beep');
  });
});
