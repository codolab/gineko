import { useEffect, useCallback, useRef } from "react";

const config = {
    attributes: true,
    characterData: true,
    subtree: true,
    childList: true
};

export default function useMutationObserver(ref, callback, options = config) {
    const observer = useRef(null);

    const destroy = useCallback(() => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    }, []);

    useEffect(() => {
        // Create an observer instance linked to the callback function
        destroy();

        if (ref.current) {
            observer.current = new MutationObserver(callback);
            // Start observing the target node for configured mutations
            observer.current.observe(ref.current, options);
            return () => {
              destroy();
            };
        }
    }, [callback, options]);
}
