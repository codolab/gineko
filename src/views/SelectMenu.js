/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { createContext, useContext, useEffect, forwardRef } from "react";
import { cls, clsx, makeStyles } from "candy-moon";
import { useSelect } from "downshift";

const useStyles = makeStyles("SelectMenu");

export const MenuContext = createContext();

const useMenu = () => useContext(MenuContext);

export default function SelectMenu({
  items = [],
  value,
  onChange,
  itemToString,
  children,
  className,
  ...rest
}) {
  const select = useSelect({
    items,
    selectedItem: value,
    onSelectedItemChange: onChange,
    itemToString,
  });
  const styles = useStyles(["base"]);

  return (
    <MenuContext.Provider value={select}>
      <div className={clsx(styles.base, className)}>
        {children({ isOpen: select.isOpen })}
      </div>
    </MenuContext.Provider>
  );
}

const Label = forwardRef(({ className, ...props }, ref) => {
  const { getLabelProps } = useMenu();
  const styles = useStyles(["labelBase"]);

  return (
    <label
      type="button"
      {...getLabelProps({
        ref,
        className: clsx(styles.labelBase, className),
        ...props,
      })}
    />
  );
});

const Button = forwardRef(({ as: Comp = "button", ...props }, ref) => {
  const { isOpen, getToggleButtonProps } = useMenu();

  useEffect(() => {
    if (!ref.current) return;

    if (!isOpen) ref.current.focus();
  }, [isOpen]);

  return (
    <Comp
      type="button"
      {...getToggleButtonProps({
        ref,
      })}
      {...props}
    />
  );
});

const Modal = ({ children, className, ...props }) => {
  const { isOpen, getMenuProps } = useMenu();

  const styles = useStyles(["modalBase", "modalContainer"]);

  return (
    <div className={clsx(styles.modalBase, className)} {...props}>
      <div
        {...getMenuProps(
          {
            className: clsx(styles.modalContainer, isOpen ? "" : cls("hidden")),
          },
          { suppressRefError: true }
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Header = ({ className, children, ...props }) => {
  const styles = useStyles(["headerBase", "headerContent"]);

  return (
    <div className={clsx(styles.headerBase, className)} {...props}>
      <span className={styles.headerContent}>{children}</span>
    </div>
  );
};

const List = ({ className, children, ...props }) => {
  const menu = useMenu();
  const styles = useStyles(["listBase"]);
  
  return (
    <div className={clsx(styles.listBase, className)} {...props}>
      {children(menu)}
    </div>
  );
};

const Item = ({ children, item, index, className, selected, ...rest }) => {
  const { getItemProps, highlightedIndex } = useMenu();
  const styles = useStyles(["itemBase"]);

  const props = item ? getItemProps({ item, index, ...rest }) : rest;

  return (
    <a
      className={clsx(
        styles.itemBase,
        selected
          ? cls("text-lightGray-900 font-medium dark:text-darkGray-100")
          : cls("text-lightGray-600 dark:text-darkGray-100"),
        highlightedIndex === index ? cls("bg-lightGray-100 dark:bg-darkGray-900") : "",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

SelectMenu.Label = Label;
SelectMenu.Button = Button;
SelectMenu.Modal = Modal;
SelectMenu.Header = Header;
SelectMenu.List = List;
SelectMenu.Item = Item;
