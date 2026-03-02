# frankhwang.com — 开发计划

## ✅ 已完成

### 合并 quick-pages 到 frankhwang
- [x] 复制静态资源到 `public/p/`（pages.json, birthday-party, countdown-timer）
- [x] 修改 `proxy.ts` — matcher 排除 `/p/` 路径
- [x] 修改 `next.config.ts` — 添加 rewrite `/p/:slug` → `/p/:slug/index.html`
- [x] 创建 API 路由 `app/api/request/route.ts`（从 CJS 转 TS，删除 CORS）
- [x] 更新 `components/quick-pages.tsx`（同源 URL）
- [x] 创建 GitHub Action `.github/workflows/generate-page.yml`
- [x] 创建生成脚本 `.github/scripts/generate.mjs`
- [x] 复制并更新 `.cursorrules`
- [x] pnpm build 通过

### quick-pages 卡片化预览
- [x] `components/project-list.tsx` — quick-pages 改为 2 列卡片网格 + iframe 缩略图预览
- [x] iframe sandbox="" 禁止 JS，纯静态渲染
- [x] transform: scale(0.28) 缩放 1280×800 → ~358×224
- [x] position: absolute + overflow-hidden 解决布局溢出
- [x] Velite 项目保持原有文字列表样式
- [x] Vercel 环境变量补充 Development 环境（AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET）
- [x] 部署到 Vercel

### Quick Pages 生成流水线修复
- [x] 修复 `app/api/request/route.ts` — 拆分 issue 创建与 label 添加为两步，防止静默失败
- [x] 创建 `docs/test-quick-pages.md` — 端到端测试文档
- [x] 关闭历史残留 Issue #1, #2（label 未应用）

### Quick Pages 生成进度反馈
- [x] 新建 `app/api/request/status/route.ts` — GET 端点，轮询 GitHub Issue 状态
  - 校验 issue number 格式 + `page-request` label 安全校验
  - Issue closed + 评论含页面 URL → `completed`
  - Issue open + 评论含 ❌ → `failed`
  - Issue open + 超 10 分钟 → `failed`（超时）
  - 其余 → `generating`
- [x] 修改 `components/quick-pages.tsx` — 提交后轮询进度
  - Status 类型改为 `idle | submitting | generating | completed | error`
  - 提交成功后保存 `issue_number`，进入 `generating` 状态
  - 延迟 3 秒后开始每 5 秒轮询 `/api/request/status?issue=N`
  - 完成 → 显示绿色成功文字 + 页面链接 + 部署提示，刷新页面列表
  - 失败 → 显示红色错误信息
  - 生成中 → CSS spinner + "页面生成中，请稍候..."
- [x] 更新 `messages/zh.json` 和 `messages/en.json` — 新增 4 个状态文案，删除 `successMessage`

## 📋 下次待办

### 合并后续配置（手动操作）
- [ ] GitHub tumusumu/frankhwang：添加 `OPENROUTER_API_KEY` secret
- [ ] GitHub tumusumu/frankhwang：添加 `LLM_MODEL` variable（可选，默认 deepseek/deepseek-chat-v3-0324）
- [ ] 端到端验证：在 `/tools` 提交测试请求，确认 issue + label + Action + 页面生成 + 进度轮询全流程通畅
- [ ] 确认一切正常后，archive quick-pages 仓库

## ⚠️ 遗留问题

- 无
