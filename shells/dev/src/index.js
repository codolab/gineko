import "preact/debug";

import * as React from "react";
import { createElement, Fragment } from "react";
import { render } from "react-dom";
import App from "src/views/App";

const container = document.getElementById("root");

render(
  <App />,
  container
);
