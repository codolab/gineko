/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { createContext, useContext, useMemo, memo } from "react";

const defaultContext = {
  initialExpand: true,
};

export const TreeContext = createContext(defaultContext);

export const useTreeContext = () => useContext(TreeContext);

function Tree({ onLineClick, children, ariaLabel = "", ...props }) {
  const initialValue = useMemo(
    () => ({
      onLineClick,
    }),
    [onLineClick]
  );

  return (
    <TreeContext.Provider value={initialValue}>
      <div tabindex="0" role="tree" aria-label={ariaLabel} {...props}>
        {children}
      </div>
    </TreeContext.Provider>
  );
}

export const stopPropagation = (event) => {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
};

export default memo(Tree);
