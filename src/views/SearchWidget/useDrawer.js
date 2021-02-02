import { useRef, useEffect, useCallback } from "react";
import { hideOthers } from "aria-hidden";

export function assignRef(ref, value) {
  if (ref == null) return;

  if (isFunction(ref)) {
    ref(value);
    return;
  }

  try {
    // @ts-ignore
    ref.current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}

export function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => assignRef(ref, value));
  };
}

export function callAllHandlers(...fns) {
  return function func(event) {
    fns.some((fn) => {
      if (fn) fn(event);
      return event.defaultPrevented;
    });
  };
}

export function useAriaHidden(ref, shouldHide) {
  useEffect(() => {
    if (!ref.current) return undefined;

    let undo = null;

    if (shouldHide && ref.current) {
      undo = hideOthers(ref.current);
    }

    return () => {
      if (shouldHide && undo) {
        undo();
      }
    };
  }, [shouldHide, ref]);
}

export default function useDrawer(props) {
  const { isOpen, onClose, id, onEsc } = props;
  const drawerRef = useRef(null);

  useAriaHidden(drawerRef, isOpen);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape" && onEsc) {
        event.stopPropagation();

        onEsc();
      }
    },
    [onEsc]
  );

  const getDrawerProps = useCallback(
    (props = {}, ref = null) => ({
      role: "dialog",
      ...props,
      ref: mergeRefs(ref, drawerRef),
      id,
      tabIndex: -1,
      "aria-modal": true,
      onClick: callAllHandlers(props.onClick, (event) =>
        event.stopPropagation()
      ),
    }),
    []
  );

  const getDrawerContainerProps = useCallback(
    (props = {}, ref = null) => ({
      ...props,
      ref,
      onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
    }),
    [onKeyDown]
  );

  return {
    isOpen,
    onClose,
    drawerRef,
    getDrawerProps,
    getDrawerContainerProps,
  };
}