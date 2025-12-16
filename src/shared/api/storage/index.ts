import { env } from "../../../config/env";
import type { ITokenStorage } from "./types";
import { cookieStrategy } from "./cookieStrategy";
import { localStorageStrategy } from "./localStorageStrategy";

// Export the correct instance based on ENV
export const tokenStore: ITokenStorage = 
  env.AUTH_STRATEGY === "LOCAL_STORAGE" 
    ? localStorageStrategy 
    : cookieStrategy;