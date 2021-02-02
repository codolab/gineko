import { baseClasses, solidClasses } from "./Button";

// how about extend?
const IconButton = {
  base: `inline-flex items-center justify-center ${baseClasses}`,
  variants: {
    appearance: {
      solid: solidClasses,
      unstyled: "border-0 bg-transparent",
    },
    size: {
      md: "h-8 min-w-8",
      unstyled: "p-0",
    },
  },
};

export default IconButton;
