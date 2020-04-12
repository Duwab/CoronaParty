import { readDocumentMeta } from './readDocumentMeta';

describe('readDocumentMeta', () => {

  let input: HTMLInputElement;
  beforeEach(() => {
    input = window.document.createElement('input');
    input.setAttribute('id', 'my-main-id');
    input.value = 'test';
    window.document.body.appendChild(input);
  });
  afterEach(() => {
    window.document.body.removeChild(input);
  });

  it('should return value of input', () => {
    expect(readDocumentMeta('my-main-id')).toEqual('test');
  });

  it('does not fail when not found', () => {
    expect(readDocumentMeta('my-main-id2')).toEqual(null);
  });

});
