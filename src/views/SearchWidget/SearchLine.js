/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { cls } from "candy-moon";
import { memo, useCallback, useMemo } from "react";

import { useSearchStateContext } from "./SearchContext";
import { useTreeContext, stopPropagation } from "./Tree";
import Highlighter from "./Highlighter";

function SearchLine({ index, style, data }) {
  const { lineMatches, file, fileIndex } = data;
  const line = lineMatches[index] || {};
  const { onLineClick } = useTreeContext();
  const { selectedFileIndex, selectedLineIndex } = useSearchStateContext();

  const handleClick = useCallback(
    (event) => {
      stopPropagation(event);
      onLineClick && onLineClick(line, file, fileIndex, index);
    },
    [onLineClick, line, file, fileIndex, index]
  );

  const selected = useMemo(
    () => selectedFileIndex === fileIndex && selectedLineIndex === index,
    [selectedFileIndex, selectedLineIndex, fileIndex, index]
  );

  return (
    <li
      className={cls(
        "flex py-1 cursor-pointer",
        "hover:bg-lightGray-100 dark-hover:bg-darkGray-800",
        selected && "bg-lightSelection dark:bg-darkSelection"
      )}
      style={style}
      onClick={handleClick}
      aria-selected={selected}
    >
      <a cls="max-w-full px-2 no-underline hover:no-underline">
        <div cls="flex items-center">
          <div
            cls={`
              min-w-12 px-3 align-top cursor-pointer whitespace-nowrap
              text-xs leading-5 text-center 
              text-gray-900 dark:text-lightGray-100
            `}
          >
            {line.lineNumber || line.lineNumber === 0
              ? line.lineNumber + 1
              : "#"}
          </div>
          <div
            cls={`
              relative max-w-full pl-0 pr-3 
              font-mono text-xs leading-5 truncate
              align-top whitespace-nowrap
              text-gray-900 dark:text-lightGray-100
            `}
          >
            <Highlighter
              highlightClassName={cls`font-semibold rounded-sm bg-lightYellow-200 dark:bg-darkYellow-400 dark:bg-opacity-50`}
              text={`${line.preview || ""}`}
              offset={line?.offsetAndLengths?.[0] || []}
            />
          </div>
        </div>
      </a>
    </li>
  );
}

export default memo(SearchLine);
