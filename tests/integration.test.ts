import { UrlParser } from "../src/lib/url-parser";

describe("Integration Tests with Real Figma URLs", () => {
  const realFigmaUrl = "";

  describe("Real Figma URL Parsing", () => {
    it("should parse the provided real Figma URL correctly", () => {
      const result = UrlParser.parse(realFigmaUrl);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("12-1590");
      expect(result.fileName).toBe("资源共享库");
    });

    it("should validate the real Figma URL as valid", () => {
      expect(UrlParser.isValidFigmaUrl(realFigmaUrl)).toBe(true);
    });

    it("should handle URL-encoded Chinese characters correctly", () => {
      const result = UrlParser.parse(realFigmaUrl);

      // 验证文件名被正确解码
      expect(result.fileName).toBe("资源共享库");
      expect(result.fileName).not.toBe(
        "%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%AB%E5%BA%93"
      );
    });

    it("should handle the m=dev parameter correctly", () => {
      // URL 包含 m=dev 参数，应该不影响解析
      const result = UrlParser.parse(realFigmaUrl);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("12-1590");
    });

    it("should parse similar URLs with different node IDs", () => {
      const urlWithDifferentNode = "";
      const result = UrlParser.parse(urlWithDifferentNode);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("9-1439");
      expect(result.fileName).toBe("资源共享库");
    });

    it("should handle URL without node-id parameter", () => {
      const urlWithoutNodeId = "";
      const result = UrlParser.parse(urlWithoutNodeId);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBeUndefined();
      expect(result.fileName).toBe("资源共享库");
    });

    it("should format fileId correctly", () => {
      const result = UrlParser.parse(realFigmaUrl);
      const formattedFileId = UrlParser.formatFileId(result.fileId);

      expect(formattedFileId).toBe("w2zcI883J2XrHRdLHUu3uk");
    });

    it("should format nodeId correctly", () => {
      const result = UrlParser.parse(realFigmaUrl);
      if (result.nodeId) {
        const formattedNodeId = UrlParser.formatNodeId(result.nodeId);
        expect(formattedNodeId).toBe("12-1590");
      }
    });
  });

  describe("URL variations", () => {
    it("should handle URLs with additional parameters", () => {
      const urlWithMoreParams = "";
      const result = UrlParser.parse(urlWithMoreParams);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("12-1590");
      expect(result.fileName).toBe("资源共享库");
    });

    it("should handle file URLs with same fileId", () => {
      const fileUrl = "";
      const result = UrlParser.parse(fileUrl);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("12-1590");
      expect(result.fileName).toBe("资源共享库");
    });

    it("should handle proto URLs with same fileId", () => {
      const protoUrl = "";
      const result = UrlParser.parse(protoUrl);

      expect(result.fileId).toBe("w2zcI883J2XrHRdLHUu3uk");
      expect(result.nodeId).toBe("12-1590");
      expect(result.fileName).toBe("资源共享库");
    });
  });
});
