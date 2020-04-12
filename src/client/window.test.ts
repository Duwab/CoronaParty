import { createObjectURL, revokeObjectURL } from './window';


describe('window', () => {

  describe('navigator', () => {

    it('exposes window.navigator', () => {
      expect(navigator).toBe(window.navigator);
    });

  });

  describe('createObjectURL', () => {

    it('calls window.URL.createObjectURL', () => {
      window.URL.createObjectURL = jest.fn().mockReturnValue('test');
      expect(createObjectURL('bla')).toBe('test');
    });

  });

  describe('createObjectURL', () => {

    it('calls window.URL.revokeObjectURL', () => {
      window.URL.revokeObjectURL = jest.fn();
      expect(revokeObjectURL('bla')).toBe(undefined);
    });

  });

});
