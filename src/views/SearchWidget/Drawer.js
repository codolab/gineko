import * as React from "react";
import {
  createContext,
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
  forwardRef,
  useEffect,
} from "react";
import { Resizable } from "re-resizable";
import { cls, clsx, makeStyles } from "candy-moon";

import { useLocalStorage } from "hooks";
import { dom } from "services";
import * as Constants from "common/constants";

import useDrawer from "./useDrawer";

const useStyles = makeStyles("Drawer");

const DrawerContext = createContext({});
DrawerContext.displayName = "DrawerContext";

function useDrawerContext() {
  return useContext(DrawerContext);
}

export function Drawer(props) {
  const { initialFocusRef, children } = props;
  const drawer = useDrawer(props);
  const context = {
    ...drawer,
    initialFocusRef,
  };

  return (
    <DrawerContext.Provider value={context}>
      {context.isOpen && children}
    </DrawerContext.Provider>
  );
}

Drawer.defaultProps = {
  onClick: () => null,
  onKeyDown: () => null,
  onClose: () => null,
  onEsc: () => null,
  id: "gineko-drawer",
};

export function DrawerFocusScope(props) {
  const { initialFocusRef } = useDrawerContext();

  useEffect(() => {
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, []);

  return props.children;
}

export const DrawerContent = forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  const [drawerWidth, setDrawerWidth] = useLocalStorage(
    Constants.SidebarWidth,
    232
  );
  const [dockRight] = useLocalStorage(Constants.DockRight, false);

  const zIndex = useRef(dom.getZIndex());

  const {
    getDrawerProps,
    getDrawerContainerProps,
    isOpen,
  } = useDrawerContext();

  const drawerProps = getDrawerProps(rest, ref);
  const containerProps = getDrawerContainerProps();

  const styles = useStyles();

  const onResizeStop = useCallback(
    (e, direction, ref, d) => {
      const newWidth = drawerWidth + d.width;
      setDrawerWidth(newWidth);
    },
    [drawerWidth, setDrawerWidth]
  );

  const onResize = useCallback(
    (e, direction, ref, d) => {
      const newWidth = drawerWidth + d.width;
      dom.syncOctotreeSidebar(newWidth);
      dom.setStyleVariable("--gineko-sidebar-width", `${newWidth}px`);
    },
    [setDrawerWidth, drawerWidth]
  );

  useLayoutEffect(() => {
    dom.setStyleVariable("--gineko-sidebar-width", `${drawerWidth}px`);
  }, []);

  useEffect(() => {
    dom.applyIndent(isOpen, dockRight);
    dom.hideOrShowOctotree(isOpen);

    return () => {
      dom.applyIndent(false, dockRight);
      dom.hideOrShowOctotree(false);
    };
  }, [isOpen, dockRight]);

  return (
    <Resizable
      defaultSize={{
        width: drawerWidth,
        height: "100%",
      }}
      enable={{
        top: false,
        right: !dockRight,
        bottom: false,
        left: dockRight,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      style={{
        position: "fixed",
        zIndex: zIndex.current,
      }}
      handleStyles={{
        right: {
          zIndex: 100,
        },
        left: {
          zIndex: 100,
        },
      }}
      maxWidth={1000}
      onResize={onResize}
      onResizeStop={onResizeStop}
      className={clsx(
        styles.base,
        dockRight ? cls("right-0") : cls("left-0"),
        className
      )}
      {...containerProps}
    >
      <DrawerFocusScope>
        <div className={styles.container}>{children}</div>
      </DrawerFocusScope>
    </Resizable>
  );
});
