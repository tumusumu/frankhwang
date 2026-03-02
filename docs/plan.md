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

## 📋 下次待办

### 合并后续配置（手动操作）
- [ ] Vercel frankhwang 项目：添加 `GITHUB_TOKEN` 环境变量
- [ ] GitHub tumusumu/frankhwang：添加 `OPENROUTER_API_KEY` secret
- [ ] GitHub tumusumu/frankhwang：添加 `LLM_MODEL` variable（可选，默认 deepseek/deepseek-chat-v3-0324）
- [ ] GitHub tumusumu/frankhwang：创建 `page-request` label
- [ ] 部署后验证：访问 `/p/birthday-party` 确认静态页面正常
- [ ] 部署后验证：访问 `/en/tools` 确认页面列表加载
- [ ] 部署后验证：表单提交到 `/api/request` 正常
- [ ] 部署后验证：创建 `page-request` Issue 触发 Action 生成新页面
- [ ] 确认一切正常后，archive quick-pages 仓库

## ⚠️ 遗留问题

- 无
