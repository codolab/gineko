const url = {
  parse: function (p) {
    const pathname = p || window.location.pathname;
    const [
      ,
      // ignore content before the first '/'
      username,
      reponame,
      type,
      ...path
    ] = unescape(decodeURIComponent(pathname)).split("/");

    return {
      username,
      reponame,
      type,
      path,
    };
  },
  parseSHA: function (p) {
    const { type, path } = url.parse(p);
    return type === "blob" || type === "tree" || type === "commit"
      ? path[0]
      : undefined;
  },
  getCurrentPath: function (branchName = "") {
    const { path, type } = url.parse();
    if (type === "blob" || type === "tree") {
      if (url.isCommitPath(path)) {
        // path = commit-SHA/path/to/item
        path.shift();
      } else {
        // path = branch/name/path/to/item or HEAD/path/to/item
        // HEAD is not a valid branch name. Getting HEAD means being detached.
        if (path[0] === "HEAD") path.shift();
        else {
          const splitBranchName = branchName.split("/");
          while (splitBranchName.length) {
            if (
              splitBranchName[0] === path[0] ||
              // Keep consuming as their heads are same
              (splitBranchName.length === 1 &&
                splitBranchName[0].startsWith(path[0]))
              // This happens when visiting URLs like /blob/{commitSHA}/path/to/file
              // and {commitSHA} is shorter than we got from DOM
            ) {
              splitBranchName.shift();
              path.shift();
            } else {
              return [];
            }
          }
        }
      }
      return path.map(decodeURIComponent);
    }
    return [];
  },
  isCommitPath: function (path) {
    return url.isCompleteCommitSHA(path[0]);
  },
  isCompleteCommitSHA: function (sha) {
    return typeof sha === "string" && /^[abcdef0-9]{40}$/i.test(sha);
  },
  inFullPage: function (p) {
    const { type, path } = url.parse(p);
    return type === "pull" || type === "commit" ? path[0] : false;
  },
  inViewCode: function () {
    const { type } = url.parse();
    return type === "blob";
  },
};

export default url;
