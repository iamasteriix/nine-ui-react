import type { ThemeTokensType } from "@lucidjs/core";


/**
 * Maps topics to payload types to enforce matching values
 */
export type StorageTopics = {
  theme: Record<string, ThemeTokensType>,
  activeTheme: string;
};


export type StorageAdapter = {
  get: <T> (key: string) => T | null | Promise<T | null>;

  set <T> (
    key: string,
    value: T
  ): void | Promise<void>;

  remove (key: string): void | Promise<void>,
};
