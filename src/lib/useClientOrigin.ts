"use client";
import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};
const getClientOrigin = () => window.location.origin;
const getServerOrigin = () => "https://wedslash.com";

export function useClientOrigin(): string {
  return useSyncExternalStore(subscribeNoop, getClientOrigin, getServerOrigin);
}
