import { memo, useCallback } from "react";

import emitter from "libs/emitter";
import { useMousetrap } from "hooks";
import * as Constants from "common/constants";

function getSelectionText() {
  let text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text.replace(/\n+$/, "");
}

const keyMap = {
  [Constants.FindCodeInFilesActionId]: ["command+shift+f", "ctrl+shift+f"],
  [Constants.FindFilesActionId]: ["command+/", "ctrl+/"],
  [Constants.ToggleSideBar]: ["command+b", "ctrl+b"],
};

const handlers = {
  [Constants.FindCodeInFilesActionId]: function () {
    const selectionText = getSelectionText();
    emitter.emit(Constants.FindCodeInFilesActionId, { selectionText });
  },
  [Constants.FindFilesActionId]: function () {
    emitter.emit(Constants.FindFilesActionId);
  },
  [Constants.ToggleSideBar]: function () {
    emitter.emit(Constants.ToggleSideBar);
  },
};

const AppKeyboardShortcuts = memo(() => {
  Object.keys(keyMap).forEach((key) => {
    useMousetrap(keyMap[key], handlers[key]);
  });

  return null;
});

export default AppKeyboardShortcuts;
