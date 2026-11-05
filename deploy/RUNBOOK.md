# 客户门户云端部署

## 当前基线

| 项目 | 值 |
| --- | --- |
| 页面地址 | `https://web.lisfes.cn` |
| API 地址 | `https://chat-web.lisfes.cn` |
| 云服务器 | `47.119.21.228` |
| 客户容器 | `chat-web-cloud-customer` |
| 边缘 Nginx | `chat-web-cloud-nginx` |
| Compose 文件 | `/opt/chat-web-cloud/customer-compose.yml` |
| 部署脚本 | `/opt/chat-web-cloud/customer-deploy.sh` |
| 基础设施网络 | `chat-web-cloud` |

客户门户是 Nest SSR，不能替换 `chat-web-cloud-nginx`。边缘 Nginx 只增加 `web.lisfes.cn` 反代，Manager 和其他域名入口保持不变。

## DNS

`web.lisfes.cn` 需要 A 记录指向 `47.119.21.228`。记录生效后签发证书：

```bash
docker stop chat-web-cloud-nginx
certbot certonly --standalone -d web.lisfes.cn --non-interactive --agree-tos --register-unsafely-without-email
docker start chat-web-cloud-nginx
```

证书目录应为 `/etc/letsencrypt/live/web.lisfes.cn`。签发后在云端 `nginx.conf` 的 `http` 块增加 443 反代，证书路径与 `chat.lisfes.cn` 相同，`proxy_pass` 指向 `chat-web-cloud-customer:5480`，然后 `nginx -t` 并 reload。

## 发布

```bash
cd /opt/chat-web-cloud
./customer-deploy.sh ghcr.io/wlisfes/chat-web-base-customer:<git-sha> customer-compose.yml
```

脚本不会删除边缘 Nginx 容器。不要对这份 Compose 使用 `--remove-orphans`。

## 验证

```bash
docker inspect chat-web-cloud-customer --format '{{.Config.Image}} {{.State.Status}} {{.State.Health.Status}}'
curl --silent --show-error --fail --header 'Host: web.lisfes.cn' http://127.0.0.1/health
```

Gateway 的 `gateway.cors.allowedOrigins` 需要包含 `https://web.lisfes.cn`，否则浏览器从客户门户访问 `https://chat-web.lisfes.cn` 会被跨域拦截。
