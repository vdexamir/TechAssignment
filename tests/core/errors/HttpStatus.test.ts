import { HttpStatus } from "../../../src";
import { describe, expect, it } from "@jest/globals";

describe("HttpStatus", () => {
  it("should match the snapshot", () => {
    expect(HttpStatus).toMatchSnapshot();
  });
});
