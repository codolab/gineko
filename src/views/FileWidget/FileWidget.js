/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { useState, useRef, useCallback, useEffect } from "react";

import * as Constants from "common/constants";
import { useEmitter } from "hooks";
import { loadWithPJAX } from "hooks/usePJAX";
import { useApp } from "views/AppContext";
import Modal from "views/Modal";
import API from "api";

import FileExplorer from "./FileExplorer";
import { mapTree, parseTree } from "./tree";

function FileWidget() {
  const { repo, cachedFiles } = useApp();
  const [open, setOpen] = useState(false);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const inputRef = useRef();
  const loaded = useRef(false);

  useEmitter(
    Constants.FindFilesActionId,
    () => {
      setOpen((prev) => !prev);
    },
    [setOpen]
  );

  const close = useCallback((cb) => setOpen(false, cb), [setOpen]);

  const handleSelectedItemChange = useCallback(
    (item) => {
      const path = `/${repo.username}/${repo.reponame}/blob/${repo.branch}/${item.inputValue}`;
      close();
      loadWithPJAX(path);
    },
    [repo, close]
  );

  useEffect(() => {
    async function handleFetchTree() {
      try {
        setLoading(true);
        const tree = await API.fetchFiles(repo);
        const parsedTree = await parseTree(tree);
        const sortedTree = await mapTree(parsedTree, cachedFiles, "path");

        setTree(sortedTree);
        setError(null);
        loaded.current = true;
      } catch (error) {
        setError(error.message);
        loaded.current = false;
      } finally {
        setLoading(false);
      }
    }

    // TODO: Settings lazy load
    if (open && !loaded.current) {
      handleFetchTree();
    }
  }, [open]);

  useEffect(() => {
    async function handleTree() {
      setLoading(true);
      const parsedTree = await parseTree(tree);
      const sortedTree = await mapTree(parsedTree, cachedFiles, "path");
      setTree(sortedTree);
      setLoading(false);
    }

    handleTree();
  }, [cachedFiles]);

  return (
    <Modal
      isOpen={open}
      onDismiss={close}
      initialFocusRef={inputRef}
      dangerouslyBypassScrollLock
      size="xl"
    >
      <FileExplorer
        ref={inputRef}
        placeholder="Jump to file..."
        items={tree}
        loading={loading}
        error={error}
        onSelectedItemChange={handleSelectedItemChange}
      />
    </Modal>
  );
}

export default FileWidget;
