import * as fs from 'fs';
import * as path from 'path';

export interface SaveOptions {
  directory?: string | undefined;
  filename?: string | undefined;
  pretty?: boolean | undefined;
  overwrite?: boolean | undefined;
}

export interface SaveResult {
  filePath: string;
  fileName: string;
  fileSize: number;
}

export class FileManager {
  private static readonly DEFAULT_FILENAME = 'figma-data.json';

  public static async saveJson(
    data: any,
    options: SaveOptions = {}
  ): Promise<SaveResult> {
    const {
      directory = process.cwd(),
      filename,
      pretty = true,
      overwrite = true
    } = options;

    // 确保目录存在
    await this.ensureDirectory(directory);

    // 生成文件名
    const finalFilename = filename || this.generateFileName(data);
    const filePath = path.join(directory, finalFilename);

    // 检查文件是否已存在
    if (!overwrite && fs.existsSync(filePath)) {
      throw new Error(`文件 ${finalFilename} 已存在，使用 --overwrite 选项覆盖`);
    }

    // 序列化数据
    const jsonContent = pretty 
      ? JSON.stringify(data, null, 2) 
      : JSON.stringify(data);

    try {
      // 写入文件
      await fs.promises.writeFile(filePath, jsonContent, 'utf-8');
      
      // 获取文件信息
      const stats = await fs.promises.stat(filePath);
      
      return {
        filePath,
        fileName: finalFilename,
        fileSize: stats.size
      };
    } catch (error) {
      console.error('保存文件失败:', error);
      throw new Error(`无法保存文件到 ${filePath}: ${error}`);
    }
  }

  private static async ensureDirectory(directory: string): Promise<void> {
    try {
      await fs.promises.access(directory);
    } catch (error) {
      try {
        await fs.promises.mkdir(directory, { recursive: true });
      } catch (mkdirError) {
        throw new Error(`无法创建目录 ${directory}: ${mkdirError}`);
      }
    }
  }

  private static generateFileName(data: any): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // 尝试从数据中提取文件名
    let baseName = this.DEFAULT_FILENAME.replace('.json', '');
    
    if (data.name) {
      // 如果有文件名，使用它
      baseName = this.sanitizeFileName(data.name);
    } else if (data.document && data.document.name) {
      // 如果有文档名，使用它
      baseName = this.sanitizeFileName(data.document.name);
    }

    return `${baseName}_${timestamp}.json`;
  }

  private static sanitizeFileName(fileName: string): string {
    // 移除或替换不安全的文件名字符
    return fileName
      .replace(/[<>:"/\\|?*]/g, '_') // 替换不安全字符
      .replace(/\s+/g, '_') // 替换空格
      .replace(/_{2,}/g, '_') // 合并多个下划线
      .replace(/^_|_$/g, '') // 移除开头和结尾的下划线
      .slice(0, 100); // 限制长度
  }

  public static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public static async validateJsonFile(filePath: string): Promise<boolean> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      JSON.parse(content);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async readJsonFile(filePath: string): Promise<any> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`无法读取文件 ${filePath}: ${error}`);
    }
  }

  public static generateProgressBar(current: number, total: number, width: number = 40): string {
    const percentage = Math.round((current / total) * 100);
    const filledWidth = Math.round((current / total) * width);
    const emptyWidth = width - filledWidth;
    
    const filledBar = '█'.repeat(filledWidth);
    const emptyBar = '░'.repeat(emptyWidth);
    
    return `[${filledBar}${emptyBar}] ${percentage}%`;
  }
}