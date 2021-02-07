import { path } from "services";
import * as Constants from "common/constants";

import extend from "./request";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/vnd.github.v3.text-match+json",
};

const request = extend({
  prefix: "https://api.github.com",
  headers: defaultHeaders,
});

const getEncodedParams = (params) => {
  const e = encodeURIComponent;
  const encodedCode = e(params.code);
  const encodedUsername = e(params.repo.username);
  const encodedReponame = e(params.repo.reponame);

  return {
    code: encodedCode,
    username: encodedUsername,
    reponame: encodedReponame,
  };
};

// TODO: FIXME
const normalizeGithubData = (data, params) => {
  const flatTextMatches = {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      text_matches: item.text_matches.reduce((acc, tm) => {
        tm.matches.forEach((m) => {
          acc.push({
            ...tm,
            matches: [m],
          });
        });

        return acc;
      }, []),
    })),
  };
  const { code, username, reponame } = getEncodedParams(params);

  return {
    openInNewTab: `/${username}/${reponame}/search?q=${code}`,
    totalCount: flatTextMatches.items.reduce((acc, curr) => {
      return (acc += curr.text_matches?.length || 0);
    }, 0),
    resultCount: flatTextMatches.total_count,
    // How get filters from git api?
    dynamicFilters: [],
    results: flatTextMatches.items
      .filter((rs) => rs && Object.keys(rs).length > 0)
      .map((rs) => ({
        name: rs.name,
        path: path.dirname(rs.path) || "",
        repository: rs.repository,
        lineMatches: rs.text_matches.map((tm) => ({
          lineNumber: null,
          preview: tm.fragment,
          offsetAndLengths: tm.matches.map((m) => [
            m.indices?.[0],
            m.indices?.[1] - m.indices?.[0] || 0,
          ]),
        })),
      })),
  };
};

const processParams = (params) => {
  const { code, username, reponame } = getEncodedParams(params);
  const q = `q=${code}+repo:${username}/${reponame}`;
  return { q };
};

export const searchCodeByGithub = async (params) => {
  try {
    const processedParams = processParams(params);
    const query = "/search/code?" + processedParams.q;

    const data = await request.get(query);

    return normalizeGithubData(data, params);
  } catch (e) {
    throw e;
  }
};

export const fetchFiles = async (params) => {
  try {
    const query = `/repos/${params.username}/${params.reponame}/git/trees/${params.branch}?recursive=1`;
    const data = await request.get(query, {
      useCache: true,
      expirys: Constants.EXPIRYS,
    });

    return {
      tree: (data.tree || []).filter((t) => t.type === "blob"),
      truncated: data.truncated,
    };
  } catch (e) {
    throw e;
  }
};
