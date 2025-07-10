// Jest 测试设置文件
import { jest } from '@jest/globals';

// 设置测试环境
beforeAll(() => {
  // 设置环境变量
  process.env.NODE_ENV = 'test';
  
  // 模拟 console 输出（可选）
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  // 清理模拟
  jest.restoreAllMocks();
});

// 全局测试工具
declare global {
  // eslint-disable-next-line no-var
  var mockFigmaResponse: any;
}

global.mockFigmaResponse = {
  name: 'Test File',
  lastModified: '2023-01-01T00:00:00.000Z',
  document: {
    id: '0:0',
    name: 'Document',
    type: 'DOCUMENT',
    children: []
  },
  components: {},
  styles: {},
  thumbnailUrl: '',
  version: '1.0.0'
};