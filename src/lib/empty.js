export default new Proxy({}, {
  get: () => () => {},
  set: () => true
});
export const FormData = window.FormData;
export const fetch = window.fetch;
export const Blob = window.Blob;
export const File = window.File;
