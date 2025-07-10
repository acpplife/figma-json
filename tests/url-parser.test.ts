import { UrlParser } from "../src/lib/url-parser";

describe("UrlParser", () => {
  describe("parse", () => {
    it("should parse design URL correctly with actual Figma URL", () => {
      const url = "";
      const result = UrlParser.parse(url);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("12-1590");
      expect(result.fileName).toBe("资源共享库");
    });

    it("should parse design URL correctly with Chinese characters", () => {
      const url = "";
      const result = UrlParser.parse(url);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("9-1439");
      expect(result.fileName).toBe("资源共享库");
    });

    it("should parse file URL correctly", () => {
      const url = "";
      const result = UrlParser.parse(url);

      expect(result.fileId).toBe("ABC123");
      expect(result.nodeId).toBeUndefined();
      expect(result.fileName).toBe("My-Design-File");
    });

    it("should parse proto URL correctly", () => {
      const url = "";
      const result = UrlParser.parse(url);

      expect(result.fileId).toBe("XYZ789");
      expect(result.nodeId).toBe("1:2");
      expect(result.fileName).toBe("Prototype");
    });

    it("should throw error for invalid URL", () => {
      expect(() => UrlParser.parse("invalid-url")).toThrow("无效的 URL 格式");
    });

    it("should throw error for non-Figma URL", () => {
      expect(() => UrlParser.parse("https://example.com")).toThrow(
        "不是有效的 Figma URL"
      );
    });

    it("should throw error for empty URL", () => {
      expect(() => UrlParser.parse("")).toThrow("无效的 URL");
    });
  });

  describe("isValidFigmaUrl", () => {
    it("should return true for valid Figma URLs", () => {
      const validUrls = [];

      validUrls.forEach((url) => {
        expect(UrlParser.isValidFigmaUrl(url)).toBe(true);
      });
    });

    it("should return false for invalid URLs", () => {
      const invalidUrls = [
        "https://example.com",
        "invalid-url",
        "",
        "https://figma.com/invalid",
      ];

      invalidUrls.forEach((url) => {
        expect(UrlParser.isValidFigmaUrl(url)).toBe(false);
      });
    });
  });

  describe("formatFileId", () => {
    it("should remove invalid characters from fileId", () => {
      expect(UrlParser.formatFileId("ABC-123_XYZ")).toBe("ABC123XYZ");
      expect(UrlParser.formatFileId("test/file:id")).toBe("testfileid");
    });
  });

  describe("formatNodeId", () => {
    it("should replace colon with dash in nodeId", () => {
      expect(UrlParser.formatNodeId("1:2")).toBe("1-2");
      expect(UrlParser.formatNodeId("123:456")).toBe("123-456");
    });
  });
});
