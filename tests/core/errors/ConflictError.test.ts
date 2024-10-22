import { describe, it, expect } from "@jest/globals";
import { ApiError, ConflictError } from "../../../src/core/errors";

describe("ConflictError", () => {
  describe("constructor", () => {
    it("should create a ConflictError", () => {
      const error = new ConflictError("test-error");
      expect(error).not.toBeUndefined();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(409);
      expect(error.message).toBe("test-error");
    });
  });
});
