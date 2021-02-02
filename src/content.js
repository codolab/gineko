import "libs/polyfills";
import * as React from "react";
import { render as _render } from "react-dom";

import $ from "libs/select-dom";
import services from "services";
import App from "views/App";

let rendered = false;

$(document).ready(() => {
  if (!services.shouldInstallExtension() || rendered) return;

  function render() {
    const root = document.createElement("div");
    document.body.appendChild(root);
    _render(<App />, root);
  }

  render();

  rendered = true;
});
