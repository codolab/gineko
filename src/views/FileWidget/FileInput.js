/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { forwardRef, memo } from "react";

import { Search } from "icons";
import Input from "views/Input";
import Spinner from "views/Spinner";

const FileInput = forwardRef(({ loading, ...props }, ref) => {
  return (
    <div cls="relative inline-block w-full">
      <div cls="absolute top-0 left-0 w-10 h-full px-4 flex items-center justify-center z-2">
        {loading ? (
          <Spinner
            size={16}
            cls="inline-block align-middle"
            sx={{ flexShrink: 0 }}
          />
        ) : (
          <Search
            size={16}
            cls="inline-block align-middle text-lightGray-900 dark:text-darkGray-100"
            sx={{ flexShrink: 0 }}
          />
        )}
      </div>
      <Input ref={ref} title="Search" cls="pl-10" size="lg" {...props} />
    </div>
  );
});

export default memo(FileInput);
