/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { forwardRef } from "react";

const ErrorMessage = forwardRef(({ message }, ref) => {
  return (
    <div
      ref={ref}
      cls="px-4 py-3 w-full flex items-center justify-center font-medium text-base text-lightRed-500 dark:text-darkRed-300"
    >
      Oops: {message}
    </div>
  );
});

ErrorMessage.displayName = "ErrorMessage";

export default ErrorMessage;
