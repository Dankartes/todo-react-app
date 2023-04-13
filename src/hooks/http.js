import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const requestReducer = (curRequestState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...curRequestState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorData };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Dispatched action does not exist!');
  }
};

const useFetch = () => {
  const [requestState, dispatchRequest] = useReducer(
    requestReducer,
    initialState
  );

  const clear = useCallback(() => {
    dispatchRequest({ type: 'CLEAR' });
  }, []);

  const sendRequest = useCallback(
    async (url, method, body, reqExtra, reqIdentifier) => {
      dispatchRequest({ type: 'SEND', identifier: reqIdentifier });

      try {
        const response = await fetch(url, {
          method: method,
          body: body,
          headers: {
            'Content-type': 'application/json',
          },
        });

        const responseData = await response.json();

        dispatchRequest({
          type: 'RESPONSE',
          responseData: responseData,
          extra: reqExtra,
        });
      } catch (error) {
        dispatchRequest({ type: 'ERROR', errorData: 'Something went wrong.' });
      }
    },
    []
  );

  return {
    isLoading: requestState.loading,
    data: requestState.data,
    error: requestState.error,
    sendRequest: sendRequest,
    reqExtra: requestState.extra,
    reqIdentifier: requestState.identifier,
    clear: clear,
  };
};

export default useFetch;
