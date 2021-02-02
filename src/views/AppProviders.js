import * as React from "react";

import ErrorBoundary from "views/ErrorBoundary";
import AppController from "views/AppContext";
import SettingsContextController from "views/Settings/SettingsContext";

export default function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <AppController>
        <SettingsContextController>{children}</SettingsContextController>
      </AppController>
    </ErrorBoundary>
  );
}
