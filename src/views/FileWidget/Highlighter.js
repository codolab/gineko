import { findAll } from "highlight-words-core";
import * as React from "react";

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter({
  activeClassName = "",
  activeIndex = -1,
  activeStyle,
  autoEscape,
  caseSensitive = false,
  className,
  findChunks,
  highlightClassName = "",
  highlightStyle = {},
  highlightTag = "mark",
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightClassName = "",
  unhighlightStyle,
  ...rest
}) {
  const chunks = findAll({
    autoEscape,
    caseSensitive,
    findChunks,
    sanitize,
    searchWords,
    textToHighlight,
  });
  const HighlightTag = highlightTag;
  let highlightIndex = -1;
  let highlightClassNames = "";
  let highlightStyles;

  return React.createElement("span", {
    className,
    ...rest,
    children: chunks.map((chunk, index) => {
      const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);

      if (chunk.highlight) {
        highlightIndex++;

        const highlightClass = highlightClassName;
        const isActive = highlightIndex === +activeIndex;

        highlightClassNames = `${highlightClass} ${
          isActive ? activeClassName : ""
        }`;
        highlightStyles =
          isActive === true && activeStyle != null
            ? Object.assign({}, highlightStyle, activeStyle)
            : highlightStyle;

        const props = {
          children: text,
          className: highlightClassNames,
          key: index,
          style: highlightStyles,
        };

        // Don't attach arbitrary props to DOM elements; this triggers React DEV warnings (https://fb.me/react-unknown-prop)
        // Only pass through the highlightIndex attribute for custom components.
        if (typeof HighlightTag !== "string") {
          props.highlightIndex = highlightIndex;
        }

        return React.createElement(HighlightTag, props);
      } else {
        return React.createElement("span", {
          children: text,
          className: unhighlightClassName,
          key: index,
          style: unhighlightStyle,
        });
      }
    }),
  });
}
