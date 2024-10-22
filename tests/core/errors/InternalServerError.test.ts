import { describe, it, expect } from "@jest/globals";
import { ApiError, InternalServerError } from "../../../src/core/errors";

describe("InternalServerError", () => {
  describe("constructor", () => {
    it("should create a InternalServerError", () => {
      const error = new InternalServerError("test-error");
      expect(error).not.toBeUndefined();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(500);
      expect(error.message).toBe("test-error");
    });
  });
});
