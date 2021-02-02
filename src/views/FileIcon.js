/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { clsx } from "candy-moon";
import { memo } from "react";
import * as fileIcons from "file-icons-js";

const FileIcon = memo(({ filename }) => {
  const className = fileIcons.getClassWithColor(filename);

  if (!filename) return null;

  return (
    <span
      className={clsx("icon octicon-file", className)}
      sx={{
        _dark: {
          filter:
            "brightness(125%) contrast(150%) drop-shadow(0 0 0 #fff) drop-shadow(1px 1px 1px #444)",
        },
      }}
    />
  );
});

export default FileIcon;
