import { Command } from 'commander';
import { FigmaClient } from '../lib/figma-client';
import { TokenManager } from '../lib/token-manager';
const chalk = require('chalk');

const tokenManager = new TokenManager();

export function createTokenCommand(): Command {
  const tokenCommand = new Command('token');
  tokenCommand.description('管理 Figma API token');

  // set token 子命令
  tokenCommand
    .command('set <token>')
    .description('设置 Figma API token')
    .option('--verify', '验证 token 有效性')
    .action(async (token: string, options: { verify?: boolean }) => {
      try {
        // 验证 token 格式
        if (!token || token.trim() === '') {
          console.error(chalk.red('❌ Token 不能为空'));
          process.exit(1);
        }

        // 如果启用验证，检查 token 有效性
        if (options.verify) {
          console.log(chalk.blue('🔍 正在验证 token...'));
          const client = new FigmaClient(token);
          const isValid = await client.validateToken();

          if (!isValid) {
            console.error(
              chalk.red('❌ 无效的 token，请检查您的 Figma API token')
            );
            process.exit(1);
          }

          console.log(chalk.green('✅ Token 验证成功'));
        }

        // 保存 token
        tokenManager.setToken(token);
        console.log(chalk.green('✅ Token 已成功保存'));
        console.log(
          chalk.gray(`配置文件位置: ${tokenManager.getConfigPath()}`)
        );
      } catch (error) {
        console.error(chalk.red('❌ 保存 token 失败:'), error);
        process.exit(1);
      }
    });

  // get token 子命令
  tokenCommand
    .command('get')
    .description('获取当前保存的 Figma API token')
    .option('--show', '显示完整的 token（默认只显示前几位）')
    .option('--path', '显示配置文件路径')
    .action((options: { show?: boolean; path?: boolean }) => {
      try {
        const token = tokenManager.getToken();

        if (!token) {
          console.log(chalk.yellow('⚠️  未设置 token'));
          console.log(
            chalk.blue('使用 figma-json token set <your-token> 来设置 token')
          );
          process.exit(1);
        }

        if (options.show) {
          console.log(chalk.green('🔑 当前 token:'));
          console.log(token);
        } else {
          // 隐藏大部分token，只显示前几位
          const maskedToken = token.slice(0, 8) + '...' + token.slice(-4);
          console.log(chalk.green('🔑 当前 token:'), maskedToken);
          console.log(chalk.gray('使用 --show 选项查看完整 token'));
        }

        if (options.path) {
          console.log(
            chalk.gray(`配置文件位置: ${tokenManager.getConfigPath()}`)
          );
        }
      } catch (error) {
        console.error(chalk.red('❌ 获取 token 失败:'), error);
        process.exit(1);
      }
    });

  // remove token 子命令
  tokenCommand
    .command('remove')
    .alias('rm')
    .description('删除保存的 Figma API token')
    .option('--confirm', '确认删除（跳过确认提示）')
    .action(async (options: { confirm?: boolean }) => {
      try {
        if (!tokenManager.hasToken()) {
          console.log(chalk.yellow('⚠️  未找到已保存的 token'));
          return;
        }

        if (!options.confirm) {
          // 这里在实际应用中可能需要交互式确认
          console.log(chalk.yellow('⚠️  即将删除已保存的 token'));
          console.log(chalk.blue('使用 --confirm 选项确认删除'));
          return;
        }

        tokenManager.removeToken();
        console.log(chalk.green('✅ Token 已删除'));
      } catch (error) {
        console.error(chalk.red('❌ 删除 token 失败:'), error);
        process.exit(1);
      }
    });

  // verify token 子命令
  tokenCommand
    .command('verify')
    .description('验证当前 token 的有效性')
    .action(async () => {
      try {
        const token = tokenManager.getToken();

        if (!token) {
          console.log(chalk.yellow('⚠️  未设置 token'));
          console.log(
            chalk.blue('使用 figma-json token set <your-token> 来设置 token')
          );
          process.exit(1);
        }

        console.log(chalk.blue('🔍 正在验证 token...'));

        const client = new FigmaClient(token);
        const isValid = await client.validateToken();

        if (isValid) {
          console.log(chalk.green('✅ Token 有效'));
        } else {
          console.log(chalk.red('❌ Token 无效或已过期'));
          console.log(
            chalk.blue('请使用 figma-json token set <new-token> 更新 token')
          );
        }
      } catch (error) {
        console.error(chalk.red('❌ 验证 token 失败:'), error);
        process.exit(1);
      }
    });

  return tokenCommand;
}
