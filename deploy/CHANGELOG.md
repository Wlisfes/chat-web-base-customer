# 客户门户部署记录

## 2026-11-06

- 变更内容：客户门户按管理端方式部署到云服务器 `47.119.21.228`。新增独立 SSR 容器 `chat-web-cloud-customer`，边缘 Nginx 增加 `web.lisfes.cn` 反代，不替换 `chat-web-cloud-nginx`。生产 API 地址为 `https://chat-web.lisfes.cn`。
- 影响机器：云服务器 `47.119.21.228`。
- 机器侧操作：DNS 增加 `web.lisfes.cn` A 记录到 `47.119.21.228`；签发 `/etc/letsencrypt/live/web.lisfes.cn`；Gateway CORS 允许 `https://web.lisfes.cn`。
- 验证命令：`docker compose -f deploy/compose.yml config --quiet`；容器健康；`Host: web.lisfes.cn` 的 `/health` 返回 `healthy`。
