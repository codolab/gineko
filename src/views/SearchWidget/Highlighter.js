/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { memo, Fragment } from "react";

import { match } from "services";

function Highlighter({ text, offset, highlightClassName }) {
  if (offset.length === 0) return <Fragment>{text}</Fragment>;

  const { before, inside, after, next } = match.preview(text, offset);

  const content = [
    <span>{before}</span>,
    <mark className={highlightClassName}>{inside}</mark>,
    <span>{after}</span>,
    next > 0 ? (
      <span cls="text-xs text-lightGray-400 ml-2 mr-1">+{next}</span>
    ) : null,
  ];

  return <Fragment>{content}</Fragment>;
}

export default memo(Highlighter);