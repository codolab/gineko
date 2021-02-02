import hash from "libs/hash";

const errorMessage = {
  DEFAULT: "Something went wrong!!!",
  400: "Bad Request",
  401: "Not Found",
  403: "API Rate limit",
  404: "Not Found",
  422: "Unprocessable Entity.",
  500: "Internal Server Error。",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

const isJSON = (response) => {
  const contentType =
    response.headers.get("Content-Type") ||
    response.headers.get("content-type");
  return contentType && contentType.match(/application\/json/i);
};

const checkStatus = (response) => {
  if (response.ok) {
    if (isJSON(response)) return response;
    throw new Error(`Support Content-Type JSON only!`);
  }

  const errorText =
    errorMessage[response.status] ||
    response.statusText ||
    errorMessage["DEFAULT"];

  const error = new Error(errorText);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  if (isJSON(response)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then((content) => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

const request = async (url, _options) => {
  const options = {
    ..._options,
  };

  const fingerprint = url + (options.body ? JSON.stringify(options.body) : "");
  const hashcode = hash.sha256().update(fingerprint).digest("hex");

  if (options.method === "POST") {
    if (!(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
    }
  }

  options.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const expirys = options.expirys && 60;

  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (e) {
    throw new Error(errorMessage["DEFAULT"]);
  }

  try {
    if (options.useCache) {
      response = cachedSave(response, hashcode);
    }
    response = checkStatus(response);

    return response.json();
  } catch (e) {
    throw e;
  }
};

const extend = ({ prefix, ..._options }) => {
  return {
    get: function (query, { useCache = false, expirys } = {}) {
      const options = {
        ..._options,
        useCache,
        expirys,
        method: "GET",
      };
      const url = prefix + query;
      return request(url, options);
    },
    post: function (params, { useCache = false, expirys } = {}) {
      const options = {
        ..._options,
        useCache,
        expirys,
        method: "POST",
        body: params,
      };

      return request(prefix, options);
    },
  };
};

export default extend;
