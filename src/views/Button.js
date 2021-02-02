import * as React from "react";
import { forwardRef } from "react";
import { clsx, makeStyles } from "candy-moon";

const useStyles = makeStyles("Button");

const Button = forwardRef(
  (
    {
      isDisabled,
      isActive,
      appearance = "solid",
      type = "button",
      size = "md",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const _isDisabled = isDisabled;
    const styles = useStyles({
      appearance,
      size,
    });

    return (
      <button
        ref={ref}
        disabled={_isDisabled}
        aria-disabled={_isDisabled}
        type={type}
        data-active={isActive ? "true" : undefined}
        className={clsx(styles.base, styles.appearance, styles.size, className)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
