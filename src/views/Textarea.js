/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { clsx } from "candy-moon";
import { forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

import Input from "./Input";

const Textarea = forwardRef((props, ref) => {
  return <Input ref={ref} as={TextareaAutosize} {...props} />;
});

Textarea.displayName = "Textarea";

export default Textarea;
