import * as React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import {
  unstable_runWithPriority as runWithPriority,
  unstable_UserBlockingPriority as UserBlockingPriority,
} from "scheduler";

import API from "api";
import { useApp } from "views/AppContext";
import { useSearch, useEmitter } from "hooks";
import * as Constants from "common/constants";
import emitter from "libs/emitter";

const SearchStateContext = createContext(null);
SearchStateContext.displayName = "SearchStateContext";

const SearchDispatcherContext = createContext(null);
SearchDispatcherContext.displayName = "SearchDispatcherContext";

function reduceSearchState(state, action) {
  let { searchText, filters } = state;
  switch (action.type) {
    case Constants.SetSearchText:
      searchText = action.payload;
      break;
    case Constants.SetFilters:
      filters = {
        ...filters,
        ...action.payload,
      };
      break;
    case Constants.ResetSearch:
      searchText = "";
      filters = {};
      break;
    default:
      return state;
  }
  return {
    ...state,
    searchText,
    filters,
  };
}

function reduceSelectionState(state, action) {
  let { selectedFileIndex, selectedLineIndex } = state;
  switch (action.type) {
    case Constants.SelectLine:
      selectedFileIndex = action.payload.fileIndex;
      selectedLineIndex = action.payload.lineIndex;
      break;
    case Constants.ResetSelection:
      selectedFileIndex = null;
      selectedLineIndex = null;
      break;
    default:
      return state;
  }
  return {
    ...state,
    selectedFileIndex,
    selectedLineIndex,
  };
}

const reducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case Constants.SetSearchText:
    case Constants.SetFilters:
    case Constants.ResetSearch:
    case Constants.SelectLine:
    case Constants.ResetSelection:
      state = reduceSearchState(state, action);
      state = reduceSelectionState(state, action);
      return state;
    default:
      throw new Error(`Unrecognized action "${type}"`);
  }
};

export default function SearchContextController({
  children,
  defaultSelectedFileIndex,
  defaultSelectedLineIndex,
  onOpen,
  onToggle,
}) {
  const { repo } = useApp();
  const [state, dispatch] = useReducer(reducer, {
    // Selection
    selectedFileIndex:
      defaultSelectedFileIndex == null ? null : defaultSelectedFileIndex,
    selectedLineIndex:
      defaultSelectedLineIndex == null ? null : defaultSelectedLineIndex,

    // Search
    searchText: "",
    filters: {},
  });

  const dispatchWrapper = useCallback(
    (action) => {
      // Run the first update at "user-blocking" priority in case dispatch is called from a non-React event.
      // In this case, the current (and "next") priorities would both be "normal",
      // and suspense would potentially block both updates.
      runWithPriority(UserBlockingPriority, () => dispatch(action));
    },
    [dispatch]
  );

  const data = useSearch(API.searchCode, {
    params: {
      code: state.searchText,
      repo,
      filters: state.filters,
    },
    onLoaded: () => {
      dispatchWrapper({ type: Constants.ResetSelection });
    },
  });

  const context = useMemo(
    () => ({
      ...state,
      ...data,
    }),
    [state, data]
  );

  useEmitter(
    Constants.FindCodeInFilesActionId,
    (payload) => {
      const searchText = payload.selectionText
        ? payload.selectionText
        : state.searchText;

      dispatchWrapper({ type: Constants.SetSearchText, payload: searchText });
      onOpen?.();
      
    },
    [dispatchWrapper, state.searchText, onOpen]
  );

  useEmitter(
    Constants.ToggleSideBar,
    (payload) => {
      onToggle?.();
    },
    [onToggle]
  );

  return (
    <SearchStateContext.Provider value={context}>
      <SearchDispatcherContext.Provider value={dispatchWrapper}>
        {children}
      </SearchDispatcherContext.Provider>
    </SearchStateContext.Provider>
  );
}

export function useSearchStateContext() {
  return useContext(SearchStateContext);
}

export function useSearchDispatcherContext() {
  return useContext(SearchDispatcherContext);
}
