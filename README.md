# figma-json

A CLI tool for downloading Figma file JSON data.

[中文文档](./README.zh.md) | [English](./README.md)

## Features

- 📥 Download Figma file data as JSON
- 🔐 Secure Figma API token management
- 🌐 Support for various Figma URL formats
- 📁 Flexible file organization and naming
- 🎨 Pretty-printed JSON output
- 🧪 Comprehensive test coverage
- 🔧 TypeScript support with strict typing
- ⚡ Fast and efficient downloads

## Installation

```bash
npm install -g figma-json
# or using pnpm
pnpm add -g figma-json
```

## Usage

### 1. Set up your Figma API token

First, you need to set up your Figma API token:

```bash
figma-json token set YOUR_FIGMA_TOKEN
```

**🔒 Security Note:** Your token is stored securely on your local machine only. It never leaves your computer or gets transmitted to any third-party services.

**How to get Figma Token:**

1. Log in to [Figma](https://www.figma.com)
2. Go to Settings → Account → Personal access tokens
3. Create a new token
4. Copy the token

### 2. Download Figma files

#### Basic usage

```bash
figma-json https://www.figma.com/design/xxx
```

#### Advanced usage

```bash
# Custom output directory
figma-json <figma-url> -o ./downloads

# Custom filename
figma-json <figma-url> -f my-design.json

# Download only specified node (if URL contains node-id)
figma-json <figma-url> --node-only

# Minified JSON output
figma-json <figma-url> --no-pretty

# Overwrite existing files
figma-json <figma-url> --overwrite

# Show file info only, don't download
figma-json <figma-url> --info
```

### 3. Token management

```bash
# View current token (masked)
figma-json token get

# View full token
figma-json token get --show

# Verify token validity
figma-json token verify

# Remove token
figma-json token remove --confirm
```

### 4. Help

```bash
figma-json --help
figma-json token --help
figma-json fetch --help
```

## Supported URL formats

The tool supports various Figma URL formats:

- `https://www.figma.com/file/{fileId}/{fileName}`
- `https://www.figma.com/design/{fileId}/{fileName}`
- `https://www.figma.com/proto/{fileId}/{fileName}`
- URLs with node-id parameter: `?node-id={nodeId}`

### How to get Figma URLs

**Method 1: Copy from browser address bar**
- Open any Figma file in your browser
- Copy the URL from the address bar

**Method 2: Copy link to specific selection** (Recommended)
1. Open your Figma file
2. Select any element (Frame, component, layer, etc.)
3. Right-click on the selected element
4. Choose **"Copy link to selection"** (or press ⌘L)
5. This generates a URL with `node-id` parameter pointing to your selected element

**Using node-specific URLs:**
- URLs with `node-id` allow you to download specific parts of a design
- Use `--node-only` flag to download only the selected element's data
- Without `--node-only`, the entire file will be downloaded regardless of the node-id

## CLI Options

### Global options

| Option            | Description       | Default |
| ----------------- | ----------------- | ------- |
| `-v, --version`   | Show version      | -       |
| `-h, --help`      | Show help         | -       |

### Download options

| Option                  | Description                    | Default        |
| ----------------------- | ------------------------------ | -------------- |
| `-o, --output <path>`   | Output directory               | Current dir    |
| `-f, --filename <name>` | Custom filename                | Auto-generated |
| `--pretty`              | Pretty-printed JSON output     | true           |
| `--no-pretty`           | Minified JSON output           | false          |
| `--overwrite`           | Overwrite existing files       | false          |
| `--node-only`           | Download only specified node   | false          |
| `--info`                | Show file info without download | false          |

## Configuration

**🔒 Local Storage:** Token and configuration are stored securely in `~/.figma-json/config.json` on your local machine. Your Figma token never leaves your computer and is not transmitted to any external services.

## Error handling

The tool provides clear error messages for common issues:

- Invalid or missing Figma token
- Network connectivity problems
- Invalid Figma URLs
- File permission issues
- API rate limiting

## Development

```bash
# Clone repository
git clone <repository-url>
cd figma-json

# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Run in development mode
pnpm run dev

# Build the project
pnpm run build

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Run all checks
pnpm run check-all
```

### Quality assurance

The project includes comprehensive quality checks:

- **TypeScript**: Strict type checking
- **ESLint**: Code style and quality rules
- **Jest**: Unit and integration tests
- **Husky**: Pre-commit hooks for code quality
- **Lint-staged**: Automatic code formatting

**Commit message format:**

```bash
type(scope): description

# Examples:
feat: add URL parsing functionality
fix(parser): handle Chinese characters
docs: update usage examples
```

### Local testing

```bash
# Link for local testing
pnpm link --global

# Test CLI
figma-json --help
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`pnpm run check-all`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Changelog

### 1.0.0

- Initial release
- Basic Figma file download functionality
- Token management
- Command-line interface
- TypeScript support
- Comprehensive test coverage