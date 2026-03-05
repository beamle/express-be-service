import { Request } from "express";
export type RequestWithBody<T> = Request<{},{}, T>;
export type RequestWithQuery<T> = Request<{},{},{},T>;
export type RequestWithRouteParams<T> = Request<T>;
export type RequestWithRouteParamsAndBody<T, B> = Request<T, {}, B>

export type RoutePathWithIdParam = { id: string }