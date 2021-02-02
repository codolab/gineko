/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { clsx, cls } from "candy-moon";

const Spinner = ({ size = 24, className, ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={clsx(
        cls("text-lightBlue-500 dark:text-darkBlue-300 animate-spin"),
        className,
      )}
      {...rest}
    >
      <circle
        cls="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        cls="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

Spinner.displayName = "Spinner";

export default Spinner;
