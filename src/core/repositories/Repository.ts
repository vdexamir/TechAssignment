import type { Entity, Updates } from "../types";

type Filterable<T extends Entity> = Partial<Omit<T, "id">>;

/**
 * Filtering parameters
 * @typeParam T - the entity to apply the filters when searching for.
 */
export type FilterParams<T extends Entity> = Filterable<T>;

/**
 * Ordering parameters
 * @typeParam T - the entity to apply the orders when searching for.
 */
export type OrderByParams<T extends Entity> = keyof Filterable<T>;

/**
 * Sort orders for searching efficiently items
 */
export const enum SortOrder {
  /**
   * Sort items in ascending order
   */
  asc = "asc",
  /**
   * Sort items in descending order
   */
  desc = "desc",
}

/**
 * SearchParams
 */
export interface SearchParams<T extends Entity> {
  readonly filters?: FilterParams<T>;
  readonly orderBy?: Record<OrderByParams<T>, SortOrder>;
}

interface ReadRepository<T extends Entity> {
  find(id: string): Promise<T | undefined>;
  search(params?: SearchParams<T>): Promise<T[]>;
}

interface WriteRepository<T extends Entity> {
  create(entity: T): Promise<void>;
  update(id: string, updates: Updates<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * A generic Repository for {@link Entity} models
 */
export type Repository<T extends Entity> = ReadRepository<T> &
  WriteRepository<T>;
