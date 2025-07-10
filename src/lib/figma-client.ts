import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface FigmaFileResponse {
  document: any;
  components: any;
  styles: any;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  [key: string]: any;
}

export interface FigmaNodeResponse {
  nodes: {
    [nodeId: string]: {
      document: any;
      components: any;
      styles: any;
    };
  };
}

export interface FigmaError {
  status: number;
  err: string;
}

export class FigmaClient {
  private axiosInstance: AxiosInstance;
  private readonly baseURL = 'https://api.figma.com/v1';

  constructor(token: string) {
    if (!token) {
      throw new Error('Figma token 不能为空');
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-Figma-Token': token,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30秒超时
    });

    // 添加请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`发送请求到: ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
          case 401:
            throw new Error('无效的 Figma token，请检查您的认证信息');
          case 403:
            throw new Error('访问被拒绝，请检查文件权限或 token 权限');
          case 404:
            throw new Error('文件或节点不存在');
          case 429:
            throw new Error('请求过于频繁，请稍后再试');
          default:
            throw new Error(`API 错误 (${status}): ${data?.err || error.message}`);
          }
        } else if (error.request) {
          throw new Error('网络连接错误，请检查您的网络连接');
        } else {
          throw new Error(`请求错误: ${error.message}`);
        }
      }
    );
  }

  public async getFile(fileId: string): Promise<FigmaFileResponse> {
    try {
      const response: AxiosResponse<FigmaFileResponse> = await this.axiosInstance.get(
        `/files/${fileId}`
      );
      
      return response.data;
    } catch (error) {
      console.error('获取文件失败:', error);
      throw error;
    }
  }

  public async getNodes(fileId: string, nodeIds: string[]): Promise<FigmaNodeResponse> {
    if (!nodeIds || nodeIds.length === 0) {
      throw new Error('节点 ID 不能为空');
    }

    try {
      const nodeIdsParam = nodeIds.join(',');
      const response: AxiosResponse<FigmaNodeResponse> = await this.axiosInstance.get(
        `/files/${fileId}/nodes?ids=${nodeIdsParam}`
      );
      
      return response.data;
    } catch (error) {
      console.error('获取节点失败:', error);
      throw error;
    }
  }

  public async getNode(fileId: string, nodeId: string): Promise<any> {
    const response = await this.getNodes(fileId, [nodeId]);
    const nodeData = response.nodes[nodeId];
    
    if (!nodeData) {
      throw new Error(`节点 ${nodeId} 不存在`);
    }
    
    return nodeData;
  }

  public async validateToken(): Promise<boolean> {
    try {
      // 尝试获取用户信息来验证 token
      await this.axiosInstance.get('/me');
      return true;
    } catch (error) {
      return false;
    }
  }

  public async getFileInfo(fileId: string): Promise<{ name: string; lastModified: string }> {
    try {
      const response = await this.getFile(fileId);
      return {
        name: response.name,
        lastModified: response.lastModified,
      };
    } catch (error) {
      console.error('获取文件信息失败:', error);
      throw error;
    }
  }
}