import { readDocumentMeta } from '../readDocumentMeta';

export default {
  getBrowserTabId() {
    readDocumentMeta('userId');
  },
};
