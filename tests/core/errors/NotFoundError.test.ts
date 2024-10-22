import { describe, it, expect } from "@jest/globals";
import { ApiError, NotFoundError } from "../../../src/core/errors";

describe("NotFoundError", () => {
  describe("constructor", () => {
    it("should create a NotFoundError", () => {
      const error = new NotFoundError("test-error");
      expect(error).not.toBeUndefined();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(404);
      expect(error.message).toBe("test-error");
    });
  });
});
