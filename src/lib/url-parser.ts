export interface FigmaUrlInfo {
  fileId: string;
  nodeId?: string | undefined;
  fileName?: string | undefined;
}

export class UrlParser {
  private static readonly FIGMA_DOMAIN = 'figma.com';
  
  public static parse(url: string): FigmaUrlInfo {
    if (!url || typeof url !== 'string') {
      throw new Error('无效的 URL');
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      throw new Error('无效的 URL 格式');
    }

    // 检查是否是 Figma URL
    if (!parsedUrl.hostname.includes(this.FIGMA_DOMAIN)) {
      throw new Error('不是有效的 Figma URL');
    }

    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    // 解析路径以获取 fileId
    const fileId = this.extractFileId(pathname);
    if (!fileId) {
      throw new Error('无法从 URL 中提取 fileId');
    }

    // 解析 nodeId
    const nodeId = this.extractNodeId(searchParams);

    // 解析文件名（可选）
    const fileName = this.extractFileName(pathname);

    return {
      fileId,
      nodeId,
      fileName
    };
  }

  private static extractFileId(pathname: string): string | null {
    // 支持的路径格式：
    // /file/{fileId}/{fileName}
    // /design/{fileId}/{fileName}
    // /proto/{fileId}/{fileName}
    const patterns = [
      /^\/file\/([a-zA-Z0-9]+)/,
      /^\/design\/([a-zA-Z0-9]+)/,
      /^\/proto\/([a-zA-Z0-9]+)/
    ];

    for (const pattern of patterns) {
      const match = pathname.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  private static extractNodeId(searchParams: URLSearchParams): string | undefined {
    // 支持的参数格式：
    // ?node-id=123-456
    // ?node-id=123%3A456
    const nodeIdParam = searchParams.get('node-id');
    if (nodeIdParam) {
      // 处理 URL 编码的冒号
      return nodeIdParam.replace('%3A', ':');
    }

    return undefined;
  }

  private static extractFileName(pathname: string): string | undefined {
    // 从路径中提取文件名
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    if (pathParts.length >= 3) {
      // 格式：['file'|'design'|'proto', fileId, fileName, ...]
      return decodeURIComponent(pathParts[2]);
    }

    return undefined;
  }

  public static isValidFigmaUrl(url: string): boolean {
    try {
      this.parse(url);
      return true;
    } catch {
      return false;
    }
  }

  public static formatFileId(fileId: string): string {
    // 确保 fileId 格式正确
    return fileId.replace(/[^a-zA-Z0-9]/g, '');
  }

  public static formatNodeId(nodeId: string): string {
    // 确保 nodeId 格式正确，将冒号替换为连字符
    return nodeId.replace(':', '-');
  }
}