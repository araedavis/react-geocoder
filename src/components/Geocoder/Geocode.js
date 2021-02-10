import { ApiKey } from "@esri/arcgis-rest-auth";
import { suggest } from '@esri/arcgis-rest-geocoding';
import debounce from 'lodash.debounce';
import { useEffect, useReducer } from 'react';

const API_KEY =
  "AAPK60004e6795f54dfb8875d4d9d43eb3f2NQ7ccYJOMHZswyEuQA2_xkxG2kOmYbtCbd1EVAtftXb9TyJfZpzIWQfgEyliK-Do"; // YOUR_API_KEY

const initialState = {
  data: undefined,
  loading: true,
  error: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: false,
      };
    case 'FETCH_ERROR':
      return {
        data: undefined,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const authentication = new ApiKey({ key: API_KEY });

function Geocode({ address, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        const res = await suggest(address, {
          params: { location: [-76.6162, 39.3043], maxSuggestions: 5 },
          authentication
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: res.suggestions });
      } catch (e) {
        dispatch({ type: 'FETCH_ERROR', payload: e.message });

        console.error(e);
      }
    });
    fetchData();
  }, [address]);

  const { data, loading, error } = state;

  return children({
    data,
    loading,
    error,
  });
}

export default Geocode;
