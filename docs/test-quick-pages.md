# Quick Pages 端到端测试文档

## 前置条件

### GitHub Secrets / Variables（tumusumu/frankhwang）

| 名称 | 类型 | 必须 | 说明 |
|------|------|------|------|
| `OPENROUTER_API_KEY` | Secret | 是 | OpenRouter API 密钥，generate.mjs 用于调用 LLM |
| `LLM_MODEL` | Variable | 否 | 默认 `deepseek/deepseek-chat-v3-0324` |

### Vercel 环境变量

| 名称 | 必须 | 说明 |
|------|------|------|
| `GITHUB_TOKEN` | 是 | Fine-grained PAT，需要 Issues (Read & Write) 权限 |
| `GITHUB_REPO` | 否 | 默认 `tumusumu/frankhwang` |

### GitHub Label

- repo 中需要存在 `page-request` label（首次添加 label 时 API 会自动创建）

---

## 测试流程

### Step 1：提交页面需求

1. 访问 `/en/tools`（或 `/zh/tools`），使用 GitHub 登录
2. 在输入框填写需求，例如："做一个简单的 hello world 页面"
3. 点击"生成"

**预期结果：**
- 按钮变为 disabled 状态，显示"生成中..."
- 提交成功后，显示 CSS spinner + "页面生成中，请稍候..."
- 浏览器 DevTools → Network 可看到每 5 秒一次的 GET `/api/request/status?issue=N` 轮询

**排查方法：**
- 浏览器 DevTools → Network → POST `/api/request`
- 检查 response body 和 status code，应包含 `issue_number`
- 如果 500：检查 Vercel Function Logs，确认 `GITHUB_TOKEN` 是否配置

### Step 2：确认 Issue 创建且带 label

1. 打开 GitHub repo Issues 页面
2. 找到新创建的 issue

**预期结果：**
- Issue 标题 = 提交的需求文本
- Issue body 包含 `## 页面需求` 和需求内容
- Issue 有 `page-request` label

**排查方法：**
```bash
# 查看最新 issue
gh issue list --repo tumusumu/frankhwang --limit 1

# 查看 issue 详情（含 labels）
gh issue view <number> --repo tumusumu/frankhwang
```

- 如果 issue 存在但无 label：检查 Vercel Function Logs 中是否有 `Label API error` 日志
- 如果有 403 错误：GITHUB_TOKEN 缺少 label 权限，需要更新 PAT

### Step 3：确认 GitHub Action 触发

1. 打开 GitHub repo → Actions tab
2. 找到 `generate-page` workflow

**预期结果：**
- Workflow 已触发（不是 skipped）
- 触发事件为 `issues` / `labeled`

**排查方法：**
```bash
# 查看最近的 workflow runs
gh run list --repo tumusumu/frankhwang --limit 5

# 查看特定 run 的详情
gh run view <run-id> --repo tumusumu/frankhwang --log
```

- 如果 workflow 未触发：issue 可能没有 `page-request` label（见 Step 2）
- 如果 workflow 失败：检查 `OPENROUTER_API_KEY` secret 是否配置

### Step 4：确认页面生成

1. 等待 Action 完成（通常 1-3 分钟）
2. 检查 repo 是否有新的 auto commit

**预期结果：**
- 新 commit 消息格式为 `auto: generate xxx`
- commit 包含 `public/p/<slug>/index.html`
- commit 更新了 `public/p/pages.json`

**排查方法：**
```bash
# 查看最新 commits
gh api repos/tumusumu/frankhwang/commits --jq '.[0:3] | .[] | .commit.message'

# 查看 pages.json 内容
gh api repos/tumusumu/frankhwang/contents/public/p/pages.json --jq '.content' | base64 -d
```

### Step 5：确认 Vercel 重新部署

1. Vercel 会自动检测到新 commit 并触发部署
2. 等待部署完成（通常 1-2 分钟）

**预期结果：**
- Vercel dashboard 显示新的 deployment
- 部署状态为 Ready

### Step 6：验证进度反馈 + 页面可访问

1. 等待 Action 完成 + Vercel 部署
2. 工具页面应自动从"生成中"切换为"页面已生成！"
3. 显示绿色成功文字 + "查看页面 →" 链接 + 部署提示
4. 页面列表应自动刷新，新页面出现在列表中
5. 点击链接跳转到 `/p/<slug>`

**预期结果：**
- 轮询自动停止
- 页面列表包含新生成的页面
- 点击后跳转到 `/p/<slug>`，页面正常渲染

**排查方法：**
- 如果一直显示"生成中"：检查 DevTools → Network → GET `/api/request/status` 的返回值
- 如果返回 `generating` 但 Action 已完成：可能 issue 未被关闭，检查 GitHub Action 日志

---

## 常见问题速查

| 症状 | 可能原因 | 解决方法 |
|------|----------|----------|
| 提交后 500 错误 | `GITHUB_TOKEN` 未配置 | Vercel 环境变量添加 `GITHUB_TOKEN` |
| Issue 无 label | Token 缺少 label 权限 | 更新 Fine-grained PAT，添加 Issues 写权限 |
| Action 未触发 | Issue 没有 `page-request` label | 见上一条 |
| Action 失败 | `OPENROUTER_API_KEY` 未配置 | `gh secret set OPENROUTER_API_KEY --repo tumusumu/frankhwang` |
| 页面未出现在列表 | Vercel 未重新部署 | 检查 Vercel dashboard，手动触发 redeploy |
| `/p/<slug>` 404 | rewrite 规则未生效 | 检查 `next.config.ts` 中 `/p/:slug` rewrite |
| 一直显示"生成中" | 轮询 API 未检测到完成 | `curl /api/request/status?issue=N` 检查返回值 |
| 轮询返回 404 | Issue 缺少 `page-request` label | 检查 issue labels，手动添加 label |

## 配置 Secrets 命令参考

```bash
# 添加 OpenRouter API Key
gh secret set OPENROUTER_API_KEY --repo tumusumu/frankhwang

# 添加 LLM Model（可选）
gh variable set LLM_MODEL --body "deepseek/deepseek-chat-v3-0324" --repo tumusumu/frankhwang
```
