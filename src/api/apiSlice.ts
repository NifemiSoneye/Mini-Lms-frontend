import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "@/features/auth/authSlice";
import { logOut } from "@/features/auth/authSlice";
type RefreshResult = {
  accessToken: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: "https://mini-lms-backend-pkgt.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(
        setCredentials({ ...(refreshResult.data as RefreshResult) }),
      );

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        (refreshResult.error.data as { message: string }).message =
          "Your login has expired.";
      }
      api.dispatch(logOut());
      return refreshResult;
    }
  }

  return result;
};
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Course", "Lesson", "Progress"],
  endpoints: (builder) => ({}),
});
