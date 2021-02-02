import mitt from "mitt";

const _emitter = mitt();

const emitter = {
  on(key, listener) {
    _emitter.on(key, listener);
  },
  off(key, listener) {
    _emitter.off(key, listener);
  },
  emit(key, payload) {
    _emitter.emit(key, payload);
  },
  clear() {
    _emitter.all.clear();
  },
};

export default emitter;
