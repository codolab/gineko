/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import {
  Fragment,
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import SelectMenu from "views/SelectMenu";
import IconButton from "views/IconButton";
import Button from "views/Button";
import { KebabHorizontal, Check, X } from "icons";
import * as Constants from "common/constants";

import {
  useSearchStateContext,
  useSearchDispatcherContext,
} from "./SearchContext";
import Expand from "./Expand";

function Filter({ focusInput }) {
  const [expanded, setExpanded] = useState(false);
  const [langs, setLangs] = useState([]);

  const { searchData, filters } = useSearchStateContext();
  const dispatch = useSearchDispatcherContext();

  const _langBtn = useRef();

  const handleChange = useCallback(
    ({ selectedItem }) => {
      dispatch({
        type: Constants.SetFilters,
        payload: {
          lang: selectedItem?.value || "",
        },
      });
    },
    [dispatch]
  );

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  useEffect(() => {
    if (expanded) {
      _langBtn.current?.focus();
    } else focusInput();
  }, [expanded]);

  useEffect(() => {
    const newLangs = searchData?.dynamicFilters || [];
    if (newLangs.length === 0 && filters?.lang) {
      dispatch({
        type: Constants.SetFilters,
        payload: {
          lang: "",
        },
      });
    }
    setLangs(newLangs);
  }, [searchData?.dynamicFilters]);

  const selectedLang = useMemo(
    () => langs.find((lang) => lang.value === filters.lang) || null,
    [langs, filters]
  );

  return (
    <div cls="relative mb-3 px-2">
      <IconButton
        cls="absolute text-lightGray-700 dark:text-darkGray-100"
        sx={{ top: "0px", right: "8px" }}
        onClick={toggle}
      >
        <KebabHorizontal size={16} />
      </IconButton>
      <Expand isExpanded={expanded}>
        <div cls="my-2">
          <SelectMenu
            items={langs}
            onChange={handleChange}
            itemToString={(item) => item?.label || ""}
          >
            {({ isOpen }) => (
              <Fragment>
                <SelectMenu.Label>Language</SelectMenu.Label>
                <SelectMenu.Button
                  ref={_langBtn}
                  as={Button}
                  cls="w-full"
                  sx={{
                    _focus: {
                      boxShadow: "0 0 0 3px rgba(3, 102, 214, 0.5) !important",
                    },
                  }}
                >
                  <span cls="text-sm truncate">{filters?.lang || "Any"}</span>
                  <span cls="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      cls="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </SelectMenu.Button>
                <SelectMenu.Modal>
                  {isOpen && (
                    <Fragment>
                      <SelectMenu.Header>Select a language</SelectMenu.Header>
                      <SelectMenu.List>
                        {({
                          selectItem,
                          closeMenu,
                          highlightedIndex,
                          getItemProps,
                        }) => (
                          <Fragment>
                            {selectedLang && (
                              <SelectMenu.Item
                                selected={false}
                                onClick={() => {
                                  selectItem(null);
                                  closeMenu();
                                }}
                              >
                                Clear language
                                <span cls="absolute inset-y-0 left-0 flex items-center pl-2">
                                  <X size={16} />
                                </span>
                              </SelectMenu.Item>
                            )}
                            {langs.map((lang, index) => {
                              const selected =
                                selectedLang?.value === lang.value;

                              return (
                                <SelectMenu.Item
                                  key={lang.value}
                                  item={lang}
                                  index={index}
                                  selected={selected}
                                >
                                  {lang.label}
                                  {selected && (
                                    <span cls="absolute inset-y-0 left-0 flex items-center pl-2">
                                      <Check size={14} viewBox="0 0 16 16" />
                                    </span>
                                  )}
                                </SelectMenu.Item>
                              );
                            })}
                          </Fragment>
                        )}
                      </SelectMenu.List>
                    </Fragment>
                  )}
                </SelectMenu.Modal>
              </Fragment>
            )}
          </SelectMenu>
        </div>
      </Expand>
    </div>
  );
}

export default memo(Filter);
