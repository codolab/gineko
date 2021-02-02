const match = {
  MAX_PREVIEW_CHARS: 250,
  getLines(text, position) {
    return text.substring(0, position).split("\n");
  },
  getMatchString: function (text, rangeInPreviewText) {
    return text.substring(
      rangeInPreviewText.startColumn - 1,
      rangeInPreviewText.endColumn - 1
    );
  },
  lcut: function (text, n) {
    if (text.length < n) {
      return text;
    }

    const re = /\b/g;
    let i = 0;
    while (re.test(text)) {
      if (text.length - re.lastIndex < n) {
        break;
      }

      i = re.lastIndex;
      re.lastIndex += 1;
    }

    return text.substring(i).replace(/^\s/, "");
  },
  preview: function (str, offset) {
    const [startCol] = offset;
    const endCol = startCol + offset[1];

    const startLineNumber = match.getLines(str, startCol).length - 1;
    const endLineNumber = match.getLines(str, endCol).length - 1;

    const fullPreviewLines = str.split("\n");
    const oneLinePreviewText = fullPreviewLines[startLineNumber];
    const startOneLine = str.indexOf(oneLinePreviewText);

    const adjustedStartCol = startCol - startOneLine;
    const adjustedEndCol = adjustedStartCol + offset[1];

    const rangeInPreviewText = {
      startLineNumber: 1,
      endLineNumber: 1,
      startColumn: adjustedStartCol + 1,
      endColumn: adjustedEndCol + 1,
    };

    let before = oneLinePreviewText.substring(
        0,
        rangeInPreviewText.startColumn - 1
      ),
      inside = match.getMatchString(oneLinePreviewText, rangeInPreviewText),
      after = oneLinePreviewText.substring(rangeInPreviewText.endColumn - 1);

    before = match.lcut(before, 26);
    before = before.trimLeft();

    let charsRemaining = match.MAX_PREVIEW_CHARS - before.length;
    inside = inside.substr(0, charsRemaining);
    charsRemaining -= inside.length;
    after = after.substr(0, charsRemaining);

    return {
      before,
      inside,
      after,
      next: endLineNumber - startLineNumber,
    };
  },
};

export default match;