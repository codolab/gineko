import * as React from "react";

import { usePJAX } from "hooks";
import AppProviders from "views/AppProviders";
import AppKeyboardShortcuts from "views/AppKeyboardShortcuts";
import SearchWidget from "views/SearchWidget/SearchWidget";
import FileWidget from "views/FileWidget/FileWidget";

import "styles";

function App() {
  usePJAX();

  return (
    <AppProviders>
      <SearchWidget />
      <FileWidget />
      <AppKeyboardShortcuts />
    </AppProviders>
  );
}

export default App;
