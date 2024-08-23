import type { Request } from 'express';

export type SearchAndQueryParams<T, K> = Request<T, never, never, K>;

export type Body<T> = Request<never, never, T, never>;

export type QueryParams<T> = Request<never, never, never, T>;

export type SearchParams<T> = Request<T, never, never, never>;
