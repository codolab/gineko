/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { memo } from "react";

import ErrorMessage from "views/ErrorMessage";

import { useSearchStateContext } from "./SearchContext";

function Message() {
  const { searchData, searchError } = useSearchStateContext();

  if (searchError) return <ErrorMessage message={searchError} />
  
  if (!searchData) return null; 

  return (
    <div cls="flex justify-between p-2 text-sm text-lightGray-600 dark:text-darkGray-300">
      <div>
        {"Founded "}
        <span cls="font-bold text-lightGray-900 dark:text-darkGray-100">
          {searchData.totalCount || 0} results
        </span>
        {" in "}
        <span cls="font-bold text-lightGray-900 dark:text-darkGray-100">
          {searchData.resultCount || 0} files
        </span>
        {" - "}
        <span>
          <a cls="underline text-lightBlue-500 dark:text-darkBlue-300" href={searchData.openInNewTab} target="_blank">Open in new tab</a>
        </span>
      </div>
    </div>
  );
}

export default memo(Message);
