/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import {
  useState,
  useCallback,
  forwardRef,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useCombobox } from "downshift";
import { FixedSizeList as List } from "react-window";
import { cls } from "candy-moon";
import Fuse from "fuse.js";
import { unstable_scheduleCallback } from "scheduler";

import { useDebounce } from "hooks";
import * as Constants from "common/constants";
import ErrorMessage from "views/ErrorMessage";
import Spinner from "views/Spinner";
import FileIcon from "views/FileIcon";
import Alert from "views/Alert";

import FileInput from "./FileInput";
import Highlighter from "./Highlighter";

const isHugRepo = (items) => items.length > Constants.HugeRepo;

const FileExplorer = forwardRef((props, ref) => {
  const { onSelectedItemChange, placeholder, items, loading, error } = props;

  const listRef = useRef(null);

  const [inputItems, setInputItems] = useState(items);
  const [inputValue, setInputValue] = useState("");
  const [shouldDebounce, setShouldDebounce] = useState(isHugRepo(items));
  const [searchLoading, setSearchLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(true);

  const scrollToItem = useCallback((highlightedIndex) => {
    if (listRef.current !== null) {
      listRef.current.scrollToItem(highlightedIndex);
    }
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        includeScore: true,
        keys: ["basename", "dirname", "path"],
      }),
    [items]
  );

  const itemToString = useCallback((item) => {
    return item?.path;
  }, []);

  const fuseSearch = useCallback(
    (inputValue) => {
      const results = fuse
        .search(inputValue, { limit: Constants.ResultFilesLimit })
        .map((v) => v.item);

      if (!inputValue || (inputValue.trim() === "" && results.length === 0))
        setInputItems(items);
      else setInputItems(results);
    },
    [fuse, items, setInputItems]
  );

  const fuseSearchDebounced = useDebounce(
    useCallback(
      (inputValue) => {
        unstable_scheduleCallback(async () => {
          const results = await fuse
            .search(inputValue, { limit: Constants.ResultFilesLimit })
            .map((v) => v.item);

          if (!inputValue || (inputValue.trim() === "" && results.length === 0))
            setInputItems(items);
          else setInputItems(results);
          setSearchLoading(false);
        });
      },
      [fuse, setInputItems, setSearchLoading]
    ),
    500
  );

  const {
    isOpen,
    selectedItem,
    highlightedIndex,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    setHighlightedIndex,
  } = useCombobox({
    inputValue,
    defaultHighlightedIndex: 0,
    defaultIsOpen: true,
    items: inputItems,
    itemToString,
    onSelectedItemChange,
    onInputValueChange: ({ inputValue, type }) => {
      if (type === useCombobox.stateChangeTypes.InputKeyDownEnter) return;
      if (shouldDebounce) {
        setSearchLoading(true);
        fuseSearchDebounced(inputValue);
      } else {
        fuseSearch(inputValue);
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;
      if (type === useCombobox.stateChangeTypes.InputBlur) return state;
      return changes;
    },
    onStateChange: (rest) => {
      if (rest.hasOwnProperty("highlightedIndex")) {
        scrollToItem(rest.highlightedIndex);
      }
    },
  });

  useEffect(() => {
    if (!loading) {
      setInputItems(items);
      setHighlightedIndex(items.length ? 0 : null);
    }
    setShouldDebounce(isHugRepo(items));
  }, [items]);

  return (
    <div cls="w-full flex-col">
      {shouldDebounce && (
        <Alert
          status="warning"
          closeable
          isOpen={isOpenAlert}
          onClose={() => {
            setIsOpenAlert(false);
            ref.current?.focus?.();
          }}
        >
          This branch is too big.
        </Alert>
      )}
      <div {...getComboboxProps()} cls="p-4 mb-2">
        <FileInput
          {...getInputProps({
            ref,
            placeholder,
            loading: searchLoading,
            onChange: (e) => {
              setInputValue(e.target.value);
            },
          })}
        />
      </div>
      <div cls="relative p-0 m-0 -mb-px" sx={{ flex: "auto" }}>
        {/* Max height = 45 * 6 */}
        <ul
          {...getMenuProps()}
          className="overflow-y-auto"
          sx={{ maxH: "270px" }}
        >
          {loading ? (
            <div cls="p-4 text-gray-300 w-full flex items-center justify-center">
              <Spinner size={24} />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <ListFile
              ref={listRef}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
              files={inputItems}
              inputValue={inputValue}
            />
          )}
        </ul>
      </div>
    </div>
  );
});

const FileItem = ({ index, style, data }) => {
  const { files, inputValue, highlightedIndex, getItemProps } = data;
  const file = files[index];

  return (
    <div
      {...getItemProps({
        item: file,
        index,
        style,
        className: cls`box-border`,
      })}
    >
      <a
        cls={`
          ${
            highlightedIndex === index
              ? `bg-lightGray-100 dark:bg-darkGray-800 text-lightBlue-500 dark:text-darkBlue-200`
              : "text-lightGray-900 dark:text-darkGray-100"
          } 
          flex items-center h-full
          px-6 py-3 space-x-2
          border-t border-lightGray-200 
          dark:border-darkGray-700 
          hover:no-underline
        `}
      >
        <FileIcon filename={file.basename} />
        <Highlighter
          highlightClassName={cls`font-semibold text-lightBlue-500 dark:text-darkBlue-200 bg-transparent`}
          searchWords={[inputValue]}
          autoEscape={true}
          textToHighlight={file.basename}
          cls="font-medium whitespace-pre"
        />
        <Highlighter
          highlightClassName={cls`text-lightBlue-500 dark:text-darkBlue-200 bg-transparent`}
          searchWords={[inputValue]}
          autoEscape={true}
          textToHighlight={file.dirname}
          cls="text-xs text-lightGray-500 truncate"
          sx={{ lineHeight: "21px" }}
        />
      </a>
    </div>
  );
};

export const ListFile = forwardRef(
  ({ highlightedIndex, getItemProps, files, inputValue }, ref) => {
    const fullHeight = files.length * Constants.HeightOfFileWidget;

    return (
      <List
        ref={ref}
        width="100%"
        height={
          fullHeight > Constants.FileListMaxHeight
            ? Constants.FileListMaxHeight
            : fullHeight
        }
        itemCount={files.length}
        itemSize={Constants.HeightOfFileWidget}
        itemData={{
          files,
          getItemProps,
          highlightedIndex,
          inputValue,
        }}
      >
        {FileItem}
      </List>
    );
  }
);

export default FileExplorer;
