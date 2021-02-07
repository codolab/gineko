import memoize from "fast-memoize";

import { path } from "services";

export const parsePath = async item => {
  return Promise.resolve({
    ...item,
    basename: path.basename(item?.path || ""),
    dirname: path.dirname(item?.path || ""),
  });
}

export const parseTree = async (tree) => {
  const newTree = [];
  await Promise.all(tree.map(async (item) => {
    const parsed = await parsePath(item);
    newTree.push(parsed);
  }));
  return newTree;
}

export const mapTree = memoize((tree, order, key) => {
  if (!Array.isArray(order) || order.length === 0) return tree;
  const treeWithoutLocalFiles = tree.filter(
    (t) => order.indexOf(t[key]) === -1
  );
  const files = order
    .map((file) => tree.find((t) => t[key] === file))
    .filter((file) => !!file);

  return Promise.resolve([...files].concat(treeWithoutLocalFiles));
});

const fakeTree = Array.from({ length: 100000 }, (_, index) => ({ path: `scripts/bundle_${index}.sh`}));