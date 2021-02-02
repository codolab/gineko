/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";

import Textarea from "views/Textarea";
import IconButton from "views/IconButton";
import Spinner from "views/Spinner";
import { X } from "icons";
import { keyBinding } from "services";
import * as Constants from "common/constants";
import { useEmitter } from "hooks";
import { unstable_scheduleCallback } from "scheduler";
import emitter from "libs/emitter";

import {
  useSearchDispatcherContext,
  useSearchStateContext,
} from "./SearchContext";

export function moveCaretToEnd(el) {
  if (typeof el.selectionStart === "number") {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined") {
    el.focus();
    const range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
}

const SearchInput = memo(
  forwardRef((props, ref) => {
    const { searchText, searchLoading, reload } = useSearchStateContext();
    const dispatch = useSearchDispatcherContext();

    const handleInputKeyPress = useCallback(
      (e) => {
        if (e.key === "Enter" && !keyBinding.isShiftKey(e)) {
          e.preventDefault();
          reload();
        }
      },
      [reload]
    );

    const handleKeyDown = useCallback(
      e => {
        if (e.keyCode === 66 && keyBinding.hasCommandModifier(e)) {
          emitter.emit(Constants.ToggleSideBar);
        }
      },
      []
    );

    const handleTextChange = useCallback(
      ({ currentTarget }) =>
        unstable_scheduleCallback(() => {
          dispatch({
            type: Constants.SetSearchText,
            payload: currentTarget.value,
          });
        }),
      [dispatch]
    );

    const resetSearch = useCallback(() => {
      dispatch({ type: Constants.ResetSearch });
      dispatch({ type: Constants.ResetSelection });

      ref.current.value = "";
      ref.current.selectionEnd = 0;
    }, [dispatch]);

    useEmitter(
      Constants.FindCodeInFilesActionId,
      (payload) => {
        if (ref.current && ref.current.value !== payload.selectionText) {
          ref.current.value = payload.selectionText;
          moveCaretToEnd(ref.current);
        }
      },
      []
    );
    
    useEffect(() => {
      if (ref.current)
        moveCaretToEnd(ref.current)
    }, []);

    return (
      <div cls="w-full px-2 pt-4 pb-3 overflow-hidden align-middle">
        <div cls="relative inline-block w-full">
          <Textarea
            ref={ref}
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            data-gramm="false"
            aria-label="Search: Type Search Term and press Enter to search"
            title="Search"
            placeholder="Search"
            cls="h-8 max-h-40 pr-8"
            onKeyPress={handleInputKeyPress}
            onKeyDown={handleKeyDown}
            onChange={handleTextChange}
            defaultValue={searchText}
            {...props}
          />
          <IconButton
            cls={`
              absolute
              ${
                !searchText
                  ? "text-lightGray-400 dark:text-darkGray-400"
                  : "text-lightGray-700 dark:text-darkGray-100"
              }
            `}
            sx={{ top: "4px", right: "2px" }}
            isCloseButton
            onClick={resetSearch}
          >
            <span cls="inline-flex items-center p-1 rounded-sm">
              {searchLoading ? <Spinner size={16} /> : <X size={16} />}
            </span>
          </IconButton>
        </div>
      </div>
    );
  })
);

export default SearchInput;
