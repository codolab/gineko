const isOSX = navigator.platform.indexOf("Mac") > -1;

const keyBinding = {
  isCtrlKeyCommand(e) {
    return !!e.ctrlKey && !e.altKey;
  },

  isShiftKey(e) {
    return e.shiftKey || e.ctrlKey || e.metaKey;
  },

  hasCommandModifier(e) {
    return isOSX ? !!e.metaKey && !e.altKey : keyBinding.isCtrlKeyCommand(e);
  },
};

export default keyBinding;
