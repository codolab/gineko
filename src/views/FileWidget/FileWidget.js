/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { useState, useRef, useCallback, useEffect } from "react";
import memoize from "fast-memoize";

import * as Constants from "common/constants";
import { useEmitter } from "hooks";
import { loadWithPJAX } from "hooks/usePJAX";
import { path } from "services";
import { useApp } from "views/AppContext";
import Modal from "views/Modal";
import API from "api";

import FileExplorer from "./FileExplorer";

const parsePath = (tree) =>
  tree.map((t) => ({
    ...t,
    basename: path.basename(t?.path || ""),
    dirname: path.dirname(t?.path || ""),
  }));

const mapOrder = memoize((tree, order, key) => {
  if (!Array.isArray(order) || order.length === 0) return tree;
  const treeWithoutLocalFiles = tree.filter(
    (t) => order.indexOf(t[key]) === -1
  );
  const files = order
    .map((file) => tree.find((t) => t[key] === file))
    .filter((file) => !!file);

  return [...files].concat(treeWithoutLocalFiles);
});

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
      // loadWithPJAX(path);
    },
    [repo, close]
  );

  useEffect(() => {
    async function handleFetchTree() {
      try {
        setLoading(true);
        const tree = await API.fetchFiles(repo);
        const sortedTree = mapOrder(tree, cachedFiles, "path");

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
    const sortedTree = mapOrder(tree, cachedFiles, "path");

    setTree(sortedTree);
  }, [cachedFiles]);

  console.log(open)

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
        items={parsePath(tree)}
        loading={loading}
        error={error}
        onSelectedItemChange={handleSelectedItemChange}
      />
    </Modal>
  );
}

export default FileWidget;
