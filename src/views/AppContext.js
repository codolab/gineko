import * as React from "react";
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
} from "react";

import services from "services";
import { url, path } from "services";
import { useLocalStorage, useMutationObserver } from "hooks";
import * as Constants from "common/constants";

const AppContext = createContext(null);
AppContext.displayName = "AppContext";

const convertArrayToObject = (array) =>
  array.reduce(
    (obj, item) => ({
      ...obj,
      [item[0]]: item[1],
    }),
    {}
  );

function deleteRepo(extras, repos) {
  const arr = Object.entries(repos).sort(
    (a, b) => a[1].timestamp - b[1].timestamp
  );
  const sliced = arr.slice(extras, arr.length);
  
  return convertArrayToObject(sliced);
}

const changes = ["js-repo-pjax-container", "blob-path"];

export default function AppController({ children }) {
  const [repo] = useState(services.resolveRepo());
  const [shouldRenderSidebar, setShouldRenderSidebar] = useState(
    services.shouldRenderSidebar()
  );
  const [cachedRepositories, setCachedRepositories] = useLocalStorage(
    "jump_to:files",
    {}
  );

  const mainElRef = useRef(
    document.querySelectorAll(
      '#js-repo-pjax-container, main[data-pjax-container], div[itemtype="http://schema.org/SoftwareSourceCode"]'
    )[0]
  );

  const mutationCallback = useCallback((mutationList) => {
    try {
      const mainEl = mutationList.find(
        (mutation) =>
          mutation.type === "childList" &&
          changes.indexOf(mutation.target?.id) !== -1
      );
      if (!mainEl) return;

      setShouldRenderSidebar(services.shouldRenderSidebar());

      let currentPath = url.getCurrentPath(repo.branch).join("/");
      if (!currentPath || currentPath === "") return;

      currentPath = path.isAbsolute(currentPath)
        ? currentPath.substring(1)
        : currentPath;

      const key = `${repo.username}/${repo.reponame}`;
      const cachedFiles = cachedRepositories[key]?.files || [];
      if (cachedFiles[0] === currentPath) return;

      let newCachedRepositories = {
        ...cachedRepositories,
        [key]: {
          timestamp: Date.now(),
          files: [currentPath].concat(
            cachedFiles
              .filter((file) => file !== currentPath)
              .slice(0, Constants.CachedFilesLimit - 1)
          ),
        },
      };

      const count = Object.keys(newCachedRepositories).length;

      if (count > Constants.CachedReposLimit) {
        const extras = count - Constants.CachedReposLimit;
        newCachedRepositories = deleteRepo(extras, newCachedRepositories);
      }

      setCachedRepositories(newCachedRepositories);
    } catch (e) {
      throw e;
    }
  }, [cachedRepositories, setShouldRenderSidebar, setCachedRepositories]);

  useMutationObserver(mainElRef, mutationCallback, {
    childList: true,
    subtree: true,
  });

  const context = useMemo(() => {
    const repoKey = `${repo.username}/${repo.reponame}`;
    return {
      repo,
      shouldRenderSidebar,
      cachedFiles: cachedRepositories[repoKey]?.files || [],
    };
  }, [repo, shouldRenderSidebar, cachedRepositories]);

  if (!repo) return null;

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
