import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

interface Config {
  token?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.figma-json');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export class TokenManager {
  private ensureConfigDir(): void {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
      // 设置目录权限为700（仅用户可读写执行）
      fs.chmodSync(CONFIG_DIR, 0o700);
    }
  }

  private readConfig(): Config {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('读取配置文件失败:', error);
    }
    return {};
  }

  private writeConfig(config: Config): void {
    try {
      this.ensureConfigDir();
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
      // 设置文件权限为600（仅用户可读写）
      fs.chmodSync(CONFIG_FILE, 0o600);
    } catch (error) {
      console.error('写入配置文件失败:', error);
      throw error;
    }
  }

  public setToken(token: string): void {
    if (!token || token.trim() === '') {
      throw new Error('Token 不能为空');
    }

    const config = this.readConfig();
    config.token = token.trim();
    this.writeConfig(config);
  }

  public getToken(): string | null {
    const config = this.readConfig();
    return config.token || null;
  }

  public hasToken(): boolean {
    return this.getToken() !== null;
  }

  public removeToken(): void {
    const config = this.readConfig();
    delete config.token;
    this.writeConfig(config);
  }

  public getConfigPath(): string {
    return CONFIG_FILE;
  }
}
