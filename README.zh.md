# figma-json

一个用于下载 Figma 文件 JSON 数据的 CLI 工具。

## 功能特性

- 🚀 从 Figma URL 直接下载文件数据
- 🔑 安全的 token 管理
- 📁 支持自定义输出目录和文件名
- 🎯 支持下载指定节点数据
- 💾 格式化或压缩 JSON 输出
- 🔍 文件信息预览
- 🛡️ 完整的错误处理和用户友好提示

## 安装

```bash
npm install -g figma-json
# 或使用 pnpm
pnpm add -g figma-json
```

## 使用方法

### 1. 设置 Figma API Token

首先，你需要设置 Figma API token：

```bash
figma-json token set YOUR_FIGMA_TOKEN
```

**🔒 安全说明：** 您的 token 仅安全存储在本地计算机上，绝不会离开您的设备或传输到任何第三方服务。

**获取 Figma Token：**

1. 登录 [Figma](https://www.figma.com)
2. 进入 Settings → Account → Personal access tokens
3. 创建新的 token
4. 复制 token 并使用上述命令设置

### 2. 下载 Figma 文件

#### 基本用法

```bash
figma-json https://www.figma.com/design/xxx
```

#### 高级用法

```bash
# 自定义输出目录
figma-json <figma-url> -o ./downloads

# 自定义文件名
figma-json <figma-url> -f my-design.json

# 仅下载指定节点（如果 URL 包含 node-id）
figma-json <figma-url> --node-only

# 压缩 JSON 输出
figma-json <figma-url> --no-pretty

# 覆盖已存在的文件
figma-json <figma-url> --overwrite

# 仅显示文件信息，不下载
figma-json <figma-url> --info
```

### 3. Token 管理

```bash
# 查看当前 token（隐藏显示）
figma-json token get

# 查看完整 token
figma-json token get --show

# 验证 token 有效性
figma-json token verify

# 删除 token
figma-json token remove --confirm
```

### 4. 查看帮助

```bash
figma-json --help
figma-json token --help
figma-json fetch --help
```

## 支持的 URL 格式

- `https://www.figma.com/design/{fileId}/{fileName}`
- `https://www.figma.com/file/{fileId}/{fileName}`
- `https://www.figma.com/proto/{fileId}/{fileName}`

支持包含 `node-id` 参数的 URL。

### 如何获取 Figma URL

**方法一：从浏览器地址栏复制**
- 在浏览器中打开任意 Figma 文件
- 从地址栏复制 URL

**方法二：复制选中元素的链接**（推荐）
1. 打开你的 Figma 文件
2. 选中任意元素（Frame、组件、图层等）
3. 右键点击选中的元素
4. 选择 **"Copy link to selection"**（或按 ⌘L）
5. 这会生成一个带有 `node-id` 参数的 URL，指向你选中的元素

**使用节点特定 URL：**
- 包含 `node-id` 的 URL 允许你下载设计的特定部分
- 使用 `--node-only` 参数仅下载选中元素的数据
- 不使用 `--node-only` 时，无论 URL 是否包含 node-id，都会下载整个文件

## 命令行选项

### 全局选项

| 选项            | 描述         | 默认值 |
| --------------- | ------------ | ------ |
| `-v, --version` | 显示版本号   | -      |
| `-h, --help`    | 显示帮助信息 | -      |

### 下载选项

| 选项                    | 描述                 | 默认值   |
| ----------------------- | -------------------- | -------- |
| `-o, --output <path>`   | 输出目录             | 当前目录 |
| `-f, --filename <name>` | 自定义文件名         | 自动生成 |
| `--pretty`              | 格式化 JSON 输出     | true     |
| `--no-pretty`           | 压缩 JSON 输出       | false    |
| `--overwrite`           | 覆盖已存在的文件     | false    |
| `--node-only`           | 仅获取指定节点数据   | false    |
| `--info`                | 显示文件信息而不下载 | false    |

## 配置文件

**🔒 本地存储：** Token 和配置信息安全存储在本地 `~/.figma-json/config.json` 文件中。您的 Figma token 绝不会离开您的计算机，也不会传输到任何外部服务。

## 错误处理

工具提供详细的错误信息和建议：

- **Token 未设置**：提示如何设置 token
- **无效 URL**：显示支持的 URL 格式
- **网络错误**：提供网络连接检查建议
- **API 错误**：显示具体的 API 错误信息
- **文件权限**：提示文件权限问题

## 开发

### 本地开发

**本项目使用 pnpm 作为包管理器：**

```bash
# 克隆仓库
git clone <repository-url>
cd figma-json

# 安装 pnpm（如果尚未安装）
npm install -g pnpm

# 安装依赖
pnpm install

# 开发模式运行
pnpm run dev

# 构建
pnpm run build

# TypeScript 语法检查
pnpm run type-check

# 代码检查
pnpm run lint

# 自动修复代码格式
pnpm run lint:fix

# 运行测试
pnpm run test

# 运行所有检查（类型检查 + 代码检查 + 测试）
pnpm run check-all
```

### 提交代码

项目使用 husky 和 lint-staged 确保代码质量：

- **预提交检查**：自动运行 TypeScript 语法检查、ESLint 和相关测试
- **提交信息规范**：必须使用规范的提交信息格式

**提交信息格式：**

```bash
type(scope): description

# 类型 (type)
feat:     新功能
fix:      错误修复
docs:     文档更新
style:    代码格式化
refactor: 重构
test:     测试相关
chore:    构建/工具相关

# 示例
git commit -m "feat: 添加 URL 解析功能"
git commit -m "fix(parser): 修复中文字符解析问题"
git commit -m "docs: 更新使用说明"
```

### 本地测试

```bash
# 创建全局链接
pnpm link --global

# 测试 CLI
figma-json --help
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### 1.0.0

- 初始版本
- 支持基本的 Figma 文件下载功能
- Token 管理
- 命令行界面
