import { useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";

export default function useDebounce(cb, delay) {
  const inputsRef = useRef(cb); // mutable ref like with useThrottle
  useEffect(() => {
    inputsRef.current = { cb, delay };
  }); //also track cur. delay

  return useCallback(
    debounce((...args) => {
      if (inputsRef.current.delay === delay) inputsRef.current.cb(...args);
    }, delay),
    [delay, debounce]
  );
}