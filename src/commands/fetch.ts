import { Command } from 'commander';
import { FigmaClient } from '../lib/figma-client';
import { FileManager } from '../lib/file-manager';
import { TokenManager } from '../lib/token-manager';
import { UrlParser } from '../lib/url-parser';
const chalk = require('chalk');

const tokenManager = new TokenManager();

export function createFetchCommand(): Command {
  const fetchCommand = new Command('fetch');
  fetchCommand.description('从 Figma 获取文件数据');

  // 直接使用 URL 作为参数（不使用子命令）
  fetchCommand
    .argument('<url>', 'Figma 文件 URL')
    .option('-o, --output <path>', '输出目录', process.cwd())
    .option('-f, --filename <name>', '自定义文件名')
    .option('--pretty', '格式化 JSON 输出', true)
    .option('--no-pretty', '压缩 JSON 输出')
    .option('--overwrite', '覆盖已存在的文件', false)
    .option('--node-only', '仅获取指定节点数据（如果 URL 包含 node-id）')
    .option('--info', '显示文件信息而不下载')
    .action(
      async (
        url: string,
        options: {
          output?: string;
          filename?: string;
          pretty: boolean;
          overwrite: boolean;
          nodeOnly?: boolean;
          info?: boolean;
        }
      ) => {
        try {
          // 检查是否有 token
          const token = tokenManager.getToken();
          if (!token) {
            console.error(chalk.red('❌ 未找到 Figma token'));
            console.log(
              chalk.blue('使用 figma-json token set <your-token> 来设置 token')
            );
            process.exit(1);
          }

          // 解析 URL
          console.log(chalk.blue('🔍 正在解析 URL...'));
          const urlInfo = UrlParser.parse(url);

          console.log(chalk.green('✅ URL 解析成功'));
          console.log(chalk.gray(`  文件 ID: ${urlInfo.fileId}`));
          if (urlInfo.nodeId) {
            console.log(chalk.gray(`  节点 ID: ${urlInfo.nodeId}`));
          }
          if (urlInfo.fileName) {
            console.log(chalk.gray(`  文件名: ${urlInfo.fileName}`));
          }

          // 创建 Figma 客户端
          const client = new FigmaClient(token);

          // 如果只是获取文件信息
          if (options.info) {
            console.log(chalk.blue('📋 正在获取文件信息...'));
            const fileInfo = await client.getFileInfo(urlInfo.fileId);

            console.log(chalk.green('📄 文件信息:'));
            console.log(chalk.gray(`  名称: ${fileInfo.name}`));
            console.log(chalk.gray(`  最后修改: ${fileInfo.lastModified}`));
            return;
          }

          // 获取数据
          let data: any;
          let dataType: string;

          if (urlInfo.nodeId && options.nodeOnly) {
            // 仅获取节点数据
            console.log(chalk.blue('📥 正在获取节点数据...'));
            data = await client.getNode(urlInfo.fileId, urlInfo.nodeId);
            dataType = 'node';
          } else {
            // 获取完整文件数据
            console.log(chalk.blue('📥 正在获取文件数据...'));
            data = await client.getFile(urlInfo.fileId);
            dataType = 'file';
          }

          console.log(chalk.green('✅ 数据获取成功'));

          // 保存文件
          console.log(chalk.blue('💾 正在保存文件...'));

          const saveResult = await FileManager.saveJson(data, {
            directory: options.output,
            filename: options.filename,
            pretty: options.pretty,
            overwrite: options.overwrite,
          });

          console.log(chalk.green('✅ 文件保存成功'));
          console.log(chalk.gray(`  文件路径: ${saveResult.filePath}`));
          console.log(
            chalk.gray(
              `  文件大小: ${FileManager.formatFileSize(saveResult.fileSize)}`
            )
          );
          console.log(chalk.gray(`  数据类型: ${dataType}`));
        } catch (error) {
          console.error(chalk.red('❌ 获取文件失败:'), error);
          process.exit(1);
        }
      }
    );

  return fetchCommand;
}

// 也可以创建一个独立的 fetch 函数，用于直接调用
export function createMainFetchCommand(): Command {
  const mainCommand = new Command();

  // 支持直接使用 URL 作为主命令
  mainCommand
    .argument('[url]', 'Figma 文件 URL')
    .option('-o, --output <path>', '输出目录', process.cwd())
    .option('-f, --filename <name>', '自定义文件名')
    .option('--pretty', '格式化 JSON 输出', true)
    .option('--no-pretty', '压缩 JSON 输出')
    .option('--overwrite', '覆盖已存在的文件', false)
    .option('--node-only', '仅获取指定节点数据（如果 URL 包含 node-id）')
    .option('--info', '显示文件信息而不下载')
    .action(async (url?: string) => {
      // 如果没有提供 URL，显示帮助
      if (!url) {
        mainCommand.help();
        return;
      }

      // 使用与 fetch 子命令相同的逻辑
      const fetchCommand = createFetchCommand();
      await fetchCommand.parseAsync(['fetch', url, ...process.argv.slice(3)]);
    });

  return mainCommand;
}
