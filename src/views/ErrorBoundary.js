import * as React from "react";
import { useErrorBoundary } from "preact/hooks";

// TODO: monitoring error
const ErrorBoundary = (props) => {
  const [error, resetError] = useErrorBoundary();
  
  if (error) {
    window.alert(error.message || "Something went wrong!!!");
    return null;
  } else {
    return props.children;
  }
};

export default ErrorBoundary;
