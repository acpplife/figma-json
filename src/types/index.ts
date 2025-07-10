// CLI 相关类型定义
export interface CLIOptions {
  output?: string;
  filename?: string;
  pretty?: boolean;
  overwrite?: boolean;
  nodeOnly?: boolean;
  info?: boolean;
}

export interface TokenOptions {
  verify?: boolean;
  show?: boolean;
  path?: boolean;
  confirm?: boolean;
}

// Figma API 相关类型定义
export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  backgroundColor?: FigmaColor;
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  strokeWeight?: number;
  cornerRadius?: number;
  children?: FigmaNode[];
  absoluteBoundingBox?: FigmaRectangle;
  relativeTransform?: number[][];
  [key: string]: any;
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaFill {
  type: string;
  color?: FigmaColor;
  gradientHandlePositions?: FigmaVector[];
  gradientStops?: FigmaGradientStop[];
  [key: string]: any;
}

export interface FigmaStroke {
  type: string;
  color?: FigmaColor;
  [key: string]: any;
}

export interface FigmaVector {
  x: number;
  y: number;
}

export interface FigmaRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaGradientStop {
  position: number;
  color: FigmaColor;
}

export interface FigmaDocument {
  id: string;
  name: string;
  type: 'DOCUMENT';
  children: FigmaNode[];
}

export interface FigmaFileData {
  document: FigmaDocument;
  components: { [key: string]: FigmaComponent };
  styles: { [key: string]: FigmaStyle };
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  componentSetId?: string;
  documentationLinks: any[];
}

export interface FigmaStyle {
  key: string;
  name: string;
  description: string;
  styleType: string;
  remote: boolean;
}

export interface FigmaNodeData {
  document: FigmaNode;
  components: { [key: string]: FigmaComponent };
  styles: { [key: string]: FigmaStyle };
}

// 文件管理相关类型定义
export interface FileMetadata {
  name: string;
  size: number;
  created: Date;
  modified: Date;
  path: string;
}

export interface DownloadProgress {
  current: number;
  total: number;
  percentage: number;
  message: string;
}

// 错误类型定义
export interface FigmaFetchError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export enum ErrorCodes {
  INVALID_URL = 'INVALID_URL',
  INVALID_TOKEN = 'INVALID_TOKEN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RATE_LIMITED = 'RATE_LIMITED',
  SAVE_ERROR = 'SAVE_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 配置相关类型定义
export interface UserConfig {
  token?: string;
  defaultOutput?: string;
  defaultPretty?: boolean;
  defaultOverwrite?: boolean;
  [key: string]: any;
}

export interface RuntimeConfig {
  userConfig: UserConfig;
  cliOptions: CLIOptions;
  environment: {
    nodeVersion: string;
    platform: string;
    arch: string;
    cwd: string;
  };
}

// 工具函数类型定义
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

// 验证函数类型定义
export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type URLValidator = (url: string) => ValidationResult;
export type TokenValidator = (token: string) => Promise<ValidationResult>;
export type FileValidator = (path: string) => ValidationResult;

// 事件相关类型定义
export interface ProgressEvent {
  type: 'progress';
  data: DownloadProgress;
}

export interface ErrorEvent {
  type: 'error';
  data: FigmaFetchError;
}

export interface SuccessEvent {
  type: 'success';
  data: {
    filePath: string;
    fileSize: number;
    dataType: string;
  };
}

export type FigmaFetchEvent = ProgressEvent | ErrorEvent | SuccessEvent;
export type EventHandler = (event: FigmaFetchEvent) => void;

// 导出常用类型组合
export type FigmaAPIResponse = FigmaFileData | FigmaNodeData;
export type CommandOptions = CLIOptions & TokenOptions;