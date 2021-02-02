/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { memo, useState, useRef, useEffect, useCallback } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList, FixedSizeList } from "react-window";

import { loadWithPJAX } from "hooks/usePJAX";
import { useApp } from "views/AppContext";
import * as Constants from "common/constants";

import {
  useSearchStateContext,
  useSearchDispatcherContext,
} from "./SearchContext";
import Tree from "./Tree";
import SearchFile from "./SearchFile";
import SearchLine from "./SearchLine";

function getMatchCountWithLimit(matchCount) {
  return matchCount > Constants.LinesLimit ? Constants.LinesLimit : matchCount;
}

function Results() {
  const { repo } = useApp();
  const { searchData, searchError } = useSearchStateContext();
  const dispatch = useSearchDispatcherContext();

  const [rows, setRows] = useState({});
  const listRef = useRef();

  useEffect(() => {
    const results = searchData?.results || [];

    const newRows = results.reduce((acc, result, i) => {
      const matchCount = result.lineMatches.reduce((acc, curr) => {
        return (acc += curr.offsetAndLengths?.length || 0);
      }, 0);

      acc[i] = {
        expanded: true,
        matchCount,
      };
      return acc;
    }, {});

    setRows(newRows);

    listRef.current?.resetAfterIndex(0);
  }, [searchData]);

  if (!searchData || !rows || searchError) return null;

  if (
    !Array.isArray(searchData.results) ||
    searchData.results?.length === 0 ||
    Object.keys(rows).length === 0
  )
    return null;

  const onLineClick = useCallback(
    (line, file, fileIndex, lineIndex) => {
      const lineNumber = line.lineNumber ? `#L${line.lineNumber + 1}` : "";
      const path = `/${repo.username}/${repo.reponame}/blob/${repo.branch}/${file.path}/${file.name}${lineNumber}`;

      dispatch({
        type: Constants.SelectLine,
        payload: { fileIndex, lineIndex },
      });
      loadWithPJAX(path);
    },
    [repo, dispatch]
  );

  const getSize = useCallback(
    (i) => {
      const current = rows[i];

      if (!current?.expanded) return Constants.HeightOfFile;

      const matchCountWithLimit = getMatchCountWithLimit(current.matchCount);
      return (
        Constants.HeightOfLine * matchCountWithLimit + Constants.HeightOfFile
      );
    },
    [rows]
  );

  const getItemProps = useCallback(
    (i) => {
      return rows[i] || {};
    },
    [rows]
  );

  const handleToggle = useCallback(
    (i) => {
      if (listRef.current) {
        listRef.current.resetAfterIndex(i);
      }

      setRows((prevState) => ({
        ...prevState,
        [i]: {
          ...prevState[i],
          expanded: !prevState[i].expanded,
        },
      }));
    },
    [setRows]
  );

  return (
    <div cls="relative flex flex-col flex-1 w-full h-full">
      <Tree cls="flex-1 w-full overflow-hidden" onLineClick={onLineClick}>
        <AutoSizer>
          {({ height, width }) => (
            <VariableSizeList
              ref={listRef}
              width={width}
              height={height}
              itemCount={searchData.results.length}
              itemSize={getSize}
              itemData={{
                results: searchData.results,
                rows,
                handleToggle,
              }}
            >
              {(props) => (
                <SearchFile {...props}>
                  {({ matchCount, result }) => (
                    <FixedSizeList
                      height={getMatchCountWithLimit(matchCount) * 28}
                      itemCount={matchCount}
                      itemSize={Constants.HeightOfLine}
                      width={width}
                      itemData={{
                        file: result,
                        lineMatches: result.lineMatches,
                        fileIndex: props.index,
                      }}
                    >
                      {SearchLine}
                    </FixedSizeList>
                  )}
                </SearchFile>
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Tree>
    </div>
  );
}

export default memo(Results);
