import { useEffect } from "react";

import emitter from "libs/emitter";

export default function useEmitter(key, cb, deps = []) {
  useEffect(() => {
    if (!(key && cb)) return;
    emitter.on(key, cb);
    return () => emitter.off(key, cb);
  }, [key, ...deps]);

  return emitter;
}
