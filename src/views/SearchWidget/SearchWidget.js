/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { memo, useState, useRef, useCallback } from "react";

import { useApp } from "views/AppContext";

import Header from "./Header";
import SearchInput from "./SearchInput";
import Filter from "./Filter";
import Message from "./Message";
import Results from "./Results";
import { Drawer, DrawerContent } from "./Drawer";
import SearchContextController from "./SearchContext";

function SearchWidget(props) {
  const [open, setOpen] = useState(false);
  const _search = useRef();
  const { shouldRenderSidebar } = useApp();

  const handleOpen = useCallback(() => {
    if (open) {
      _search.current.focus();
      return;
    }
    setOpen(true);
  }, [open, setOpen]);

  const handleToggle = useCallback(() => {
    setOpen(prev => !prev);
  }, [setOpen]);

  const focusInput = useCallback(() => {
    _search.current?.focus?.();
  }, []);

  return (
    <SearchContextController onOpen={handleOpen} onToggle={handleToggle}>
      <Drawer isOpen={open && shouldRenderSidebar} initialFocusRef={_search}>
        <DrawerContent>
          <Header setOpen={setOpen} />
          <div cls="flex flex-col flex-1 border-r border-l border-lightGray-200 dark:border-darkGray-700">
            <SearchInput ref={_search} />
            <Filter focusInput={focusInput} />
            <Message />
            <Results />
          </div>
        </DrawerContent>
      </Drawer>
    </SearchContextController>
  );
}

export default memo(SearchWidget);
