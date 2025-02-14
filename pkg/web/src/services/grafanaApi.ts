import { buildRetryFetchBaseQuery } from './retryFetchBaseQuery';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import queryString from 'query-string';

type FetchDashboardDetailArgs = {
  dashboardUid: string;
  craneUrl?: string;
};

interface FetchDashboardListArgs {
  craneUrl: string | undefined;
}

interface FetchSeriesListArgs {
  craneUrl: string | undefined;
  match: string;
  start: string;
  end: string;
}

export const grafanaApi = createApi({
  reducerPath: 'grafanaApi',
  baseQuery: buildRetryFetchBaseQuery(
    fetchBaseQuery({
      baseUrl: '',
      timeout: 15000,
      prepareHeaders: (headers, api) => headers,
      fetchFn: (input, init) => fetch(input, { ...init }),
    }),
  ),
  endpoints: (builder) => ({
    fetchDashboardList: builder.query<any, FetchDashboardListArgs>({
      query: (args) => ({
        url: `${args.craneUrl ?? ''}/grafana/api/search`,
        method: 'get',
      }),
    }),
    fetchDashboardDetail: builder.query<any, FetchDashboardDetailArgs>({
      query: (args) => ({
        url: `${args.craneUrl ?? ''}/grafana/api/dashboards/uid/${args.dashboardUid}`,
        method: 'get',
      }),
    }),
    fetchSeriesList: builder.query<any, FetchSeriesListArgs>({
      query: (args) => {
        // trans to second
        // crane_analysis_resource_recommendation{namespace=~"(crane-system|default|kube-node-lease|kube-public)"}
        const url = queryString.stringifyUrl({
          url: `${args.craneUrl ?? ''}/grafana/api/datasources/proxy/1/api/v1/series`,
          query: {
            'match[]': args.match,
            start: args.start,
            end: args.end,
          },
        });
        return {
          url,
          method: 'get',
        };
      },
    }),
  }),
});

export const {
  useLazyFetchDashboardListQuery,
  useLazyFetchDashboardDetailQuery,
  useFetchDashboardListQuery,
  useFetchDashboardDetailQuery,
  useFetchSeriesListQuery,
} = grafanaApi;
