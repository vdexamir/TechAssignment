import { randomUUID } from "crypto";

/**
 * Generates a random UUID v4 string
 * @returns a UUID v4 string
 * @example "123e4567-e89b-12d3-a456-426614174000"
 * @remarks
 * A UUID v4 consists of 32 hexadecimal characters, split into five groups
 * separated by hyphens, following the pattern 8-4-4-4-12.
 * 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' where x is any hexadecimal digit and y is one of 8, 9, A, or B
 * @privateRemarks
 * This function is a wrapper around the Node.js crypto.randomUUID() function
 */
export function uuidV4(): string {
  return randomUUID();
}
