import * as React from "react";
import { setup as setupJSX } from "candy-moon/jsx";
import { configure } from "candy-moon";

import primer from "./primer";
import base from "./base";

setupJSX(React.createElement);

configure({
  presets: [primer],
  base,
});