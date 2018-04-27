import { resetCodeCache } from '../src/utils/warning';

beforeEach(() => {
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});

  resetCodeCache();
});
