import { searchCodeByGithub, fetchFiles } from "./github";
import { searchCodeBySourceGraph } from "./sourcegraph";

const searchCode = async (params) => {
  try {
    const sourcegraphData = await searchCodeBySourceGraph(params);
    if (sourcegraphData?.results?.length > 0) return sourcegraphData;

    const githubData = await searchCodeByGithub(params);
    return githubData;
  } catch (e) {
    if (e.type === "sourceGraph") {
      try {
        const githubData = await searchCodeByGithub(params);
        return githubData;
      } catch (githubError) {
        throw githubError;
      }
    }
    throw e;
  }
};

const API = {
  searchCode,
  fetchFiles,
};

export default API;