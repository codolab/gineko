/** @jsx jsx */
import { jsx } from "candy-moon/jsx";
import { memo } from "react";

import IconButton from "views/IconButton";
import { Repo, GitBranch, ChevronLeft } from "icons";
import { useApp } from "views/AppContext";
import { loadWithPJAX } from "hooks/usePJAX";

function Header({ setOpen }) {
  const { repo } = useApp();

  const handleCloseWidget = () => {
    setOpen(false);
  };

  return (
    <div
      cls="box-border flex px-2 border-r border-l bg-lightGray-800 text-darkGray-100 border-lightGray-700 dark:border-darkGray-700 dark:bg-darkGray-800"
      sx={{ _md: { height: 62 } }}
      data-gineko-theme="dark"
    >
      <div cls="flex items-center justify-between w-full max-w-full">
        <div aria-label="Breadcrumb" cls="flex flex-col min-w-0 space-y-1">
          <div cls="flex items-center">
            <Repo
              cls="mr-2 text-darkGray-300 min-w-4"
              size={16}
              viewBox="0 0 16 16"
            />
            <span cls="inline-block whitespace-nowrap">
              <a
                cls="no-underline text-darkBlue-300"
                href={`/${repo.username}`}
              >
                {repo.username}
              </a>
            </span>
            <span cls="mx-1 text-darkGray-400">/</span>
            <strong cls="inline-block truncate whitespace-nowrap">
              <a
                cls="no-underline text-darkBlue-300"
                href={`/${repo.username}/${repo.reponame}`}
                onClick={(e) => {
                  event.preventDefault();
                  loadWithPJAX(`/${repo.username}/${repo.reponame}`);
                }}
              >
                {repo.reponame}
              </a>
            </strong>
          </div>
          <div cls="flex items-center">
            <GitBranch
              cls="inline-block mr-2 text-darkGray-300 min-w-4"
              size={14}
              viewBox="0 0 16 16"
            />
            <span cls="text-xs truncate">{repo.branch}</span>
          </div>
        </div>
        <div cls="flex items-center ml-2">
          <IconButton
            onClick={handleCloseWidget}
            appearance="solid"
            size="md"
            isRound
          >
            <ChevronLeft cls="inline-block" size={16} viewBox="0 0 16 16" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default memo(Header);
