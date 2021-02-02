import * as React from "react";
import { forwardRef } from "react";
import { clsx, cls, makeStyles } from "candy-moon";

const useStyles = makeStyles("IconButton");

const IconButton = forwardRef(
  (
    {
      children,
      isRound,
      isCloseButton,
      "aria-label": ariaLabel,
      appearance = "unstyled",
      size = "unstyled",
      className,
      ...rest
    },
    ref
  ) => {
    const styles = useStyles({ appearance, size });

    const iconButtonClass = clsx(
      styles.base,
      styles.appearance,
      styles.size,
      isRound ? cls("rounded-full") : cls("rounded-lg"),
      (!isCloseButton && appearance === "unstyled") && cls("hover:text-lightBlue-500 dark-hover:text-darkBlue-300")
    );

    return (
      <button
        className={clsx(iconButtonClass, className)}
        ref={ref}
        aria-label={ariaLabel}
        appearance={appearance}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default IconButton;
