// https://github.com/EnixCoda/Gitako/blob/7f182e26e92033b4e7ba9e4a063ef991820fff79/src/utils/hooks/usePJAX.ts
import * as React from "react";
import Pjax from "pjax-api";

import $ from "libs/select-dom";
import * as Constants from "common/constants";

import useEvent from "./useEvent";

const GH_PJAX_CONTAINER_SEL = ".repository-content";

const loadPath = (path) => {
  window.location.href = path;
};

const config = {
  areas: [GH_PJAX_CONTAINER_SEL],
  update: {
    css: false,
  },
  fetch: {
    cache(path) {
      return path;
    },
  },
  link: "a:not(a)", // this helps fixing the go-back-in-history issue
  form: "form:not(form)", // prevent blocking form submissions
  fallback(target, reason) {
    // prevent unexpected reload
  },
};

export default function usePJAX() {
  // make history travel work
  React.useEffect(() => {
    new Pjax({
      ...config,
      filter() {
        return false;
      },
    });
  }, []);

  // bindings for legacy support
  useRedirectedEvents(window, "pjax:fetch", "pjax:start", document);
  useRedirectedEvents(document, "pjax:ready", "pjax:end");
  // octotree
  useRedirectedEvents(document, "pjax:content", Constants.LocChange);
}

export const loadWithPJAX = (path) => {
  if (location.pathname === path) return;

  const pathWithoutAnchor = path.replace(/#.*$/, "");
  const isSamePage = location.pathname === pathWithoutAnchor;
  const loadWithPjax = !!$(GH_PJAX_CONTAINER_SEL) && !isSamePage;
  
  if (loadWithPjax) {
    const url = location.protocol + "//" + location.host + path;
    Pjax.assign(url, config);
  } else loadPath(path);
};

export function useOnPJAXDone(callback) {
  useEvent("pjax:end", callback, document);
}

export function useRedirectedEvents(
  originalTarget,
  originalEvent,
  redirectedEvent,
  redirectToTarget = originalTarget
) {
  useEvent(
    originalEvent,
    () => {
      redirectToTarget.dispatchEvent(new Event(redirectedEvent));
    },
    originalTarget
  );
}
