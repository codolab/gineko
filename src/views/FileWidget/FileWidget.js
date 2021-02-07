/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { useRef, useCallback, useEffect, useReducer } from "react";

import * as Constants from "common/constants";
import { useEmitter } from "hooks";
import { loadWithPJAX } from "hooks/usePJAX";
import { useApp } from "views/AppContext";
import Modal from "views/Modal";
import API from "api";

import FileExplorer from "./FileExplorer";
import { mapTree, parseTree } from "./tree";

const reducer = (state, action) => {
  const { type } = action;
  let { isOpenModal, isOpenAlert, truncated, tree, loading, error } = state;

  switch (action.type) {
    case "fetch.tree.pending":
      tree = [];
      truncated = false;
      loading = true;
      error = null;
      break;
    case "fetch.tree.success":
      tree = action.payload.tree;
      truncated = action.payload.truncated;
      loading = false;
      error = null;
      break;
    case "fetch.tree.error":
      tree = [];
      truncated = false;
      loading = false;
      error = action.payload.error;
      break;
    case "modal.set":
      isOpenModal = action.payload;
      break;
    case "alert.set":
      isOpenAlert = action.payload;
      break;
    default:
      return state;
  }
  return {
    ...state,
    isOpenModal,
    isOpenAlert,
    tree,
    truncated,
    loading,
    error,
  };
};

function FileWidget() {
  const { repo, cachedFiles } = useApp();

  const [state, dispatch] = useReducer(reducer, {
    isOpenModal: false,
    isOpenAlert: true,

    truncated: false,
    tree: [],
    loading: false,
    error: false,
  });

  const inputRef = useRef();
  const loaded = useRef(false);

  useEmitter(
    Constants.FindFilesActionId,
    () => {
      dispatch({ type: "modal.set", payload: true });
    },
    []
  );

  const handleDismiss = useCallback(() => {
    dispatch({ type: "modal.set", payload: false });
  }, []);

  const handleSelectedItemChange = useCallback(
    (item) => {
      const path = `/${repo.username}/${repo.reponame}/blob/${repo.branch}/${item.inputValue}`;
      handleDismiss();
      loadWithPJAX(path);
    },
    [repo, handleDismiss]
  );

  const handleSetIsOpenAlert = useCallback(() => {
    dispatch({ type: "alert.set", payload: false });
  }, []);

  useEffect(() => {
    async function handleFetchTree() {
      try {
        dispatch({ type: "fetch.tree.pending" });
        const { tree, truncated } = await API.fetchFiles(repo);
        const parsedTree = await parseTree(tree);
        const sortedTree = await mapTree(parsedTree, cachedFiles, "path");

        dispatch({
          type: "fetch.tree.success",
          payload: {
            tree: sortedTree,
            truncated,
          },
        });
        loaded.current = true;
      } catch (error) {
        dispatch({
          type: "fetch.tree.error",
          payload: {
            error: error.message,
          },
        });
        loaded.current = false;
      }
    }

    // TODO: Settings lazy load
    if (state.isOpenModal && !loaded.current) {
      handleFetchTree();
    }
  }, [state.isOpenModal]);

  useEffect(() => {
    async function handleTree() {
      dispatch({ type: "fetch.tree.pending" });
      const parsedTree = await parseTree(state.tree);
      const sortedTree = await mapTree(parsedTree, cachedFiles, "path");

      dispatch({
        type: "fetch.tree.success",
        payload: {
          tree: sortedTree,
          truncated: state.truncated,
        },
      });
    }

    handleTree();
  }, [cachedFiles]);

  return (
    <Modal
      isOpen={state.isOpenModal}
      onDismiss={handleDismiss}
      initialFocusRef={inputRef}
      dangerouslyBypassScrollLock
      size="xl"
    >
      <FileExplorer
        ref={inputRef}
        placeholder="Jump to file..."
        onSelectedItemChange={handleSelectedItemChange}
        setIsOpenAlert={handleSetIsOpenAlert}
        {...state}
      />
    </Modal>
  );
}

export default FileWidget;
