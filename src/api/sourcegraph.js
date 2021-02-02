import { path } from "services";
import * as Constants from "common/constants";

import extend from "./request";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "*/*",
};

const request = extend({
  prefix: "https://sourcegraph.com/.api/graphql",
  headers: defaultHeaders,
});

const normalizeSourceGraphData = (data, params) => {
  return {
    openInNewTab: `https://sourcegraph.com/search?q=${encodeURIComponent(params.query)}`,
    totalCount: data.matchCount,
    resultCount: data.results.length,
    dynamicFilters: data.dynamicFilters.filter((f) => f.kind === "lang"),
    results: data.results
      .filter((rs) => rs && Object.keys(rs).length > 0)
      .map((rs) => ({
        name: path.basename(rs.file.path || "") || "",
        path: path.dirname(rs.file.path || "") || "",
        repository: rs.repository,
        lineMatches: rs.lineMatches,
      })),
  };
};

const processParams = (params) => {
  const filters = Object.keys(params.filters)
    .map((key) => params.filters[key])
    .join(" ");

  const query = `repo:^github\.com/${params.repo.username}/${params.repo.reponame}$@${params.repo.branch} content:${params.code} ${filters}`;

  return { query };
};

export const searchCodeBySourceGraph = async (params) => {
  try {
    const processedParams = processParams(params);
    const data = await request.post(
      {
        query: `
        query ($query: String!) {
          search(query: $query) {
            results {
              matchCount
              dynamicFilters {
                label
                value
                kind
                count
              }
              results {
                ... on FileMatch {
                  __typename
                  file {
                    commit {
                      oid
                    }
                    path
                    url
                  }
                  limitHit
                  lineMatches {
                    lineNumber
                    preview
                    offsetAndLengths
                  }
                  repository {
                    name
                    url
                  }
                }
              }
            }
          }
        }
      `,
        variables: processedParams,
      },
      { useCache: true, expirys: Constants.EXPIRYS }
    );

    if (data.errors) {
      throw new Error(data.errors[0] && data.errors[0].message);
    }
    const results = data.data.search.results;
    return normalizeSourceGraphData(results, processedParams);
  } catch (e) {
    e.type = "sourceGraph";
    throw e;
  }
};
