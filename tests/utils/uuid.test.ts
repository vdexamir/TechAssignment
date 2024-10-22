import { describe, it, expect } from "@jest/globals";
import { uuidV4 } from "../../src/utils";

const UUID_V4_PATTERN =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

describe("uuidV4", () => {
  it("should generate a UUIDv4 string", () => {
    const result = uuidV4();
    expect(result).toMatch(UUID_V4_PATTERN);
  });

  it("should produce a completely random UUIDv4 string every time it is generated.", () => {
    const firstResult = uuidV4();
    const secondResult = uuidV4();
    expect(firstResult).not.toEqual(secondResult);
  });
});