import { describe, it, expect } from "@jest/globals";
import { ApiError, BadRequestError } from "../../../src/core/errors";

describe("BadRequestError", () => {
  describe("constructor", () => {
    it("should create a BadRequestError", () => {
      const error = new BadRequestError("test-error");
      expect(error).not.toBeUndefined();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(400);
      expect(error.message).toBe("test-error");
    });
  });
});
