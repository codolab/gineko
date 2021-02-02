export default function $(sel, cb, o) {
  if (isDocument(sel)) return createDocument(sel);
  const el = document.querySelector(sel);
  if (el) {
    return cb ? cb(el) : el;
  }
  return o ? o() : null;
}

const isDocument = (sel) =>
  typeof sel === "object" &&
  sel.constructor &&
  sel.constructor.name === "HTMLDocument";

const createDocument = (doc) => {
  return {
    ready: function (cb) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", cb);
      } else {
        cb();
      }
    },
  };
};