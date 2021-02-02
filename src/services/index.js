import match from "./match";
import dom from "./dom";
import keyBinding from './keyBinding';
import url from "./url";
import path from "./path";
import storage from "./storage";

const services = {
  resolveRepo: function () {
    const branch = dom.getCurrentBranch() || url.parseSHA();
    const repo = {
      ...url.parse(),
      branch,
    };
    return repo;
  },
  shouldRenderSidebar: function () {
    return Boolean(dom.inCodePage() || url.inFullPage());
  },
  shouldInstallExtension: function() {
    return dom.inRepoPage();
  },
};

export { dom, url, path, match, storage, keyBinding };

export default services;
