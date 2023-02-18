import { ParsedUrlQuery } from 'querystring';

/**
 * a tree of statically typed route nodes (or, href-generators)
 */
export const TypedRoutes = {
  index: '/',
  models: {
    index: `/models`,
    show: (modelId: number, viewId?: number) => {
      if (viewId) {
        return `/models/${modelId}?view=${viewId}`;
      }
      return `/models/${modelId}`;
    },
  },
  users: {
    index: `/users`,
    show: (userId: number) => `/users/${userId}`,
  },
  auth: '/auth',
  settings: {
    index: '/settings',
  },
  about: '/about',
} as const;

/**
 * extract route (in URL path) param if there is one
 */
export type TypedRouteParam<RouteNode> = RouteNode extends (param: infer Param) => string
  ? Param & ParsedUrlQuery
  : Record<never, string>;
