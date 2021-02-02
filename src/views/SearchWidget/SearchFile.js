/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { memo } from "react";

import { ChevronDown, ChevronRight } from "icons";
import FileIcon from "views/FileIcon";

import Expand from "./Expand";
import { useTreeContext, stopPropagation } from "./Tree";

function SearchFile({ index, style, data, children }) {
  const { handleToggle, rows, results } = data;
  const result = results[index];

  const { expanded, matchCount } = rows[index] || {};
  const { path, name } = result;

  return (
    <div cls="flex flex-col" style={style}>
      <div
        cls={`
          box-border flex items-center cursor-pointer select-none
          px-2 py-2 space-x-2
          text-sm
          bg-white border-t border-lightGray-200
          hover:bg-lightGray-100
          dark:bg-darkGray-900 dark:border-darkGray-700
          dark-hover:bg-darkGray-800
        `}
        onClick={() => handleToggle(index)}
      >
        <div cls="flex items-center flex-1 min-w-0 max-w-full space-x-2">
          {expanded ? (
            <ChevronDown
              cls="inline-block min-w-4"
              size={16}
              viewBox="0 0 16 16"
            />
          ) : (
            <ChevronRight
              cls="inline-block min-w-4"
              size={16}
              viewBox="0 0 16 16"
            />
          )}
          <FileIcon filename={name} />
          <span cls="font-semibold whitespace-pre">{name}</span>
          <span cls="text-xs truncate whitespace-pre text-lightGray-500">
            {path}
          </span>
        </div>
        <div cls="block">
          <div
            cls={`
              inline-flex items-center justify-center 
              rounded-full w-5 h-5 mr-1 px-1.5
              text-xs font-medium 
              text-lightBlue-500 bg-lightBlue-500 bg-opacity-10 
              dark:text-darkBlue-300 dark:bg-darkBlue-300 dark:bg-opacity-10
            `}
          >
            {matchCount}
          </div>
        </div>
      </div>
      <Expand isExpanded={expanded}>{children({ matchCount, result })}</Expand>
    </div>
  );
}

export default memo(SearchFile);
