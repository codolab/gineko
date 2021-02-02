import { useEffect } from "react";

const defaultTarget = window;

const isListenerType1 = (target) => {
  return !!target.addEventListener;
};
const isListenerType2 = (target) => {
  return !!target.on;
};

const useEvent = (name, handler, target = defaultTarget, options) => {
  useEffect(() => {
    if (!handler) {
      return;
    }
    if (!target) {
      return;
    }
    if (isListenerType1(target)) {
      target.addEventListener(name, handler, options);
    } else if (isListenerType2(target)) {
      target.on(name, handler, options);
    }
    return () => {
      if (isListenerType1(target)) {
        target.removeEventListener(name, handler, options);
      } else if (isListenerType2(target)) {
        target.off(name, handler, options);
      }
    };
  }, [name, handler, target, JSON.stringify(options)]);
};

export default useEvent;
