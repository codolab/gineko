import * as React from "react";
import { cls } from 'candy-moon';

export default function Expand({ children, isExpanded }) {
  return (
    <div
      className={cls("hidden opacity-0 h-0", isExpanded && "block opacity-100 h-auto")}
    >
      {children}
    </div>
  );
}
