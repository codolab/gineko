import { useEffect, useRef, useState, useCallback } from "react";

import { useDebounce, useUpdate } from "hooks";

const initialState = {
  searchLoading: false,
  searchError: null,
  searchData: null,
};

export default function useSearch(
  api,
  { params, cache, wait = 300, onLoaded }
) {
  const mounted = useRef(false);
  const requestId = useRef(0);

  const [state, setState] = useState(initialState);

  const fetchAPI = useCallback(
    async (params, id) => {
      try {
        const response = await api(params);

        return {
          response: {
            data: response,
            requestId: id,
          },
        };
      } catch (e) {
        return {
          response: {
            error: e,
            requestId: id,
          },
        };
      }
    },
    [api]
  );

  const reset = useCallback(
    (overrides) => {
      setState({ ...initialState, ...overrides });
    },
    [setState]
  );

  const prepareFetch = useCallback(() => {
    if (state.searchLoading) return;

    setState((prev) => ({ ...prev, searchLoading: true }));
  }, [state.searchLoading, setState]);

  const doFetch = useCallback(async () => {
    if (!mounted.current) {
      return;
    }

    requestId.current++;

    prepareFetch();

    const {
      response: { data, requestId: id, error },
    } = await fetchAPI(params, requestId.current);

    if (mounted.current && id === requestId.current) {
      if (error) {
        setState({
          searchLoading: false,
          searchError: error.message,
          searchData: null,
        });
        return;
      }
      setState({
        searchLoading: false,
        searchError: null,
        searchData: data,
      });

      onLoaded?.();
    }
  }, [prepareFetch, fetchAPI, setState, onLoaded, params]);

  const doFetchDebounced = useDebounce(() => {
    doFetch();
  }, wait);

  const reload = useCallback(() => {
    if (params.code === "" || params.code.trim() === "") {
      setState(initialState);
      return;
    }

    doFetch();
  }, [doFetch, setState, params]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useUpdate(() => {
    if (params.code === "" || params.code.trim() === "") {
      setState(initialState);
      return;
    }
    doFetchDebounced();
  }, [params.code]);

  useUpdate(() => {
    reload();
  }, [params.filters]);

  return {
    ...state,
    reload,
  };
}
