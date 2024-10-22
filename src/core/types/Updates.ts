import type { Entity } from "./Entity";

type Updatable<T extends Entity> = keyof Omit<T, "id" | "createdAt">;

/**
 * A map of updates for an entity
 */
export type Updates<T extends Entity> = Partial<{
  readonly [Property in Updatable<T>]: T[Property];
}>;
