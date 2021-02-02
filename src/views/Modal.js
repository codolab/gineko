/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { forwardRef } from "react";
import { clsx, makeStyles } from "candy-moon";

const useStyles = makeStyles("Modal");

const Modal = forwardRef((props, ref) => {
  const { size, className, children, ...rest } = props;

  const styles = useStyles({ size });

  return (
    <DialogOverlay
      ref={ref}
      className={clsx(styles.overlay, className)}
      {...rest}
    >
      <DialogContent className={styles.content}>
        {children}
      </DialogContent>
    </DialogOverlay>
  );
});

Modal.displayName = "Input";

Modal.defaultProps = {
  size: "md",
};

export default Modal;
