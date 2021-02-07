import * as React from "react";
import { forwardRef, useState } from "react";
import { cls, clsx, sx, makeStyles } from "candy-moon";

import IconButton from "views/IconButton";
import { X } from "icons";

const useStyles = makeStyles("Alert");

export const statuses = {
  info: { light: "lightBlue", dark: "darkBlue" },
  warning: { light: "lightYellow", dark: "darkYellow" },
  success: { light: "lightGreen", dark: "darkGreen" },
  error: { light: "lightRed", dark: "darkRed" },
};

const Alert = forwardRef(
  (
    { status = "info", className, closeable, isOpen = true, onClose, ...rest },
    ref
  ) => {
    const [open, setOpen] = useState(isOpen);
    const styles = useStyles({
      color: statuses[status] || {},
    });

    const handleCloseAlert = () => {
      setOpen(false);
      onClose?.();
    };

    if (!open) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(styles.base, styles.status, className)}
        {...rest}
      >
        {rest.children}
        {closeable && (
          <IconButton
            className={clsx(
              styles.closeIcon,
              cls("absolute"),
              sx({ top: "12px", right: "12px" })
            )}
            isCloseButton
            onClick={handleCloseAlert}
          >
            <span cls="inline-flex items-center p-1 rounded-sm">
              <X size={16} />
            </span>
          </IconButton>
        )}
      </div>
    );
  }
);

export default Alert;
