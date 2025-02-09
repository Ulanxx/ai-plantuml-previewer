# PlantUML Previewer

一个现代化的 PlantUML 编辑和预览工具，支持实时预览和智能 AI 辅助功能。

## ✨ 特性

### 当前功能
- 📝 实时编辑与预览
  - 左侧代码编辑器，支持语法高亮
  - 右侧实时 PlantUML 图表预览
  - 可调节编辑器与预览区域比例
- 💾 导出功能
  - 一键导出为 PNG 图片
- 🎨 现代化界面
  - 简洁美观的 UI 设计
  - 流畅的交互动画
  - 自定义主题支持

### 即将推出
- 🤖 AI 智能助手
  - 自然语言描述生成 UML 图表
  - AI 优化和建议现有图表
  - 智能代码补全
- 📚 历史记录
  - 自动保存编辑历史
  - 版本对比和回滚
  - 云端同步

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- pnpm >= 8

### 安装
```bash
# 克隆项目
git clone https://github.com/yourusername/plantuml-previewer.git

# 进入项目目录
cd plantuml-previewer

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🛠️ 技术栈

- **前端框架**: React + Vite
- **编辑器**: CodeMirror
- **UML 渲染**: react-plantuml
- **UI 组件**: 
  - react-resizable-panels (面板分割)
  - html-to-image (图片导出)

## 📝 使用指南

1. **编辑 UML**
   - 在左侧编辑器中编写 PlantUML 代码
   - 支持实时语法检查和错误提示

2. **预览**
   - 右侧实时显示 UML 图表
   - 自动适应预览区域大小

3. **导出**
   - 点击顶部工具栏的"Export PNG"按钮
   - 自动下载当前图表的 PNG 文件

## 🔜 开发计划

### 第一阶段 (当前)
- [x] 基础编辑器功能
- [x] 实时预览
- [x] PNG 导出

### 第二阶段
- [ ] AI 生成 UML
- [ ] 历史记录功能
- [ ] 主题定制

### 第三阶段
- [ ] 云端存储
- [ ] 团队协作
- [ ] 模板市场

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)