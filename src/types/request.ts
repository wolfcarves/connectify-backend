import type { Request } from 'express';

export type RouteAndQueryParams<T, K> = Request<T, never, never, K>;

export type Body<T> = Request<never, never, T, never>;

export type QueryParams<T> = Request<never, never, never, T>;

export type RouteParams<T> = Request<T, never, never, never>;
