import { sx } from "candy-moon";

import $ from "libs/select-dom";

import url from "./url";

const indentMLClass = sx({
  ml: "var(--gineko-sidebar-width)",
});

const indentMRClass = sx({
  mr: "var(--gineko-sidebar-width)",
});

const dom = {
  getCurrentBranch: function () {
    const summarySel = [
      "#branch-select-menu summary",
      ".branch-select-menu summary",
    ].join();
    const summaryEl = $(summarySel);
    if (summaryEl) {
      const spanEl = summaryEl.querySelector("span");
      if (spanEl) {
        const branchNameInSpan = spanEl.innerText;
        if (!branchNameInSpan.includes("…")) return branchNameInSpan;
      }
      const defaultTitle = "Switch branches or tags";
      const title = summaryEl.title.trim();
      if (title !== defaultTitle && !title.includes(" ")) return title;
    }

    return null;
  },
  getZIndex: function () {
    return 1000000002;
  },
  getHtmlEl: function () {
    return document.documentElement || document.getElementsByTagName("html")[0];
  },
  setStyleVariable: function (name, value, el = dom.getHtmlEl()) {
    if (!el) return;
    el.style.setProperty(name, value);
  },
  applyIndent: function (open, dockerRight) {
    const htmlEl = dom.getHtmlEl();
    if (open) {
      htmlEl.classList.add(dockerRight ? indentMRClass : indentMLClass);
    } else {
      htmlEl.classList.remove(dockerRight ? indentMRClass : indentMLClass);
    }
  },
  inCodePage: function () {
    const { type } = url.parse();
    const branchSel = ["#branch-select-menu", ".branch-select-menu"].join();
    return type !== "commits" && Boolean($(branchSel));
  },
  inRepoPage: function () {
    const repoSel = ['nav[aria-label="Repository"]', 'span[itemprop="author"]'].join();
    return Boolean($(repoSel));
  },
  // Octotree Helpers
  getOctotreeEl: function () {
    const octotreeSel = ".octotree-sidebar";
    const octotreeEl = $(octotreeSel);
    return octotreeEl;
  },
  syncOctotreeSidebar: function (width) {
    const octotreeEl = dom.getOctotreeEl();
    if (octotreeEl) {
      octotreeEl.style.width = `${width}px`;
      dom.setStyleVariable("--octotree-sidebar-width", `${width}px`);
    }
  },
  hideOrShowOctotree: function (open) {
    const octotreeEl = dom.getOctotreeEl();
    if (octotreeEl) {
      if (open) {
        octotreeEl.style.display = "none";
      } else octotreeEl.style.display = "block";
    }
  },
};

export default dom;
