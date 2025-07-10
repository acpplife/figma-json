#!/bin/bash

# 初始化 husky 的脚本
echo "🔧 初始化 husky..."

# 安装 husky
npx husky install

# 确保钩子文件有执行权限
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/_/husky.sh

echo "✅ husky 初始化完成！"
echo "现在提交代码时会自动运行代码检查。"