export const readDocumentMeta = (id: string) => {
  const el = window.document.getElementById(id) as HTMLInputElement;
  return el && el.value;
};
