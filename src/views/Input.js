/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { forwardRef } from "react";
import { clsx, makeStyles } from "candy-moon";

const useStyles = makeStyles("Input");

const Input = forwardRef((props, ref) => {
  const {
    size,
    appearance,
    as: Comp = "input",
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    isReadOnly,
    className,
    ...rest
  } = props;

  const styles = useStyles({ size, appearance });

  return (
    <Comp
      ref={ref}
      aria-readonly={isReadOnly}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      className={clsx(styles.base, styles.appearance, styles.size, className)}
      {...rest}
    />
  );
});

Input.displayName = "Input";

Input.defaultProps = {
  size: "md",
  appearance: "solid",
};

export default Input;
