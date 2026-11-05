#!/bin/sh
set -eu

IMAGE=${1:?用法：deploy.sh IMAGE [COMPOSE_FILE]}
COMPOSE_FILE=${2:-compose.yml}
SERVICE=customer
CONTAINER=chat-web-cloud-customer
DOMAIN=web.lisfes.cn
NGINX_CONTAINER=chat-web-cloud-nginx
HEALTH_TIMEOUT=${HEALTH_TIMEOUT:-120}
PULL_ATTEMPTS=${PULL_ATTEMPTS:-8}
COMPOSE_PROJECT=${COMPOSE_PROJECT:-chat-web-cloud}
NGINX_CONFIG=${NGINX_CONFIG_PATH:-/opt/chat-web-cloud/nginx.conf}
deployment_started=0

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "找不到 Compose 文件：$COMPOSE_FILE" >&2
    exit 1
fi

command -v docker >/dev/null || { echo '未找到 Docker。' >&2; exit 1; }

compose() {
    IMAGE="$IMAGE" docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" "$@"
}

if ! compose config --quiet; then
    echo '客户门户 Compose 配置校验失败。' >&2
    exit 1
fi

old_image=$(docker inspect --format '{{.Config.Image}}' "$CONTAINER" 2>/dev/null || true)

rollback() {
    echo '客户门户部署失败，输出最新容器日志。' >&2
    docker logs --tail 100 "$CONTAINER" 2>&1 || true
    if [ -n "$old_image" ] && [ "$old_image" != "$IMAGE" ]; then
        echo "回滚到 $old_image" >&2
        IMAGE="$old_image" docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" up -d --no-deps "$SERVICE" || true
    else
        echo '没有可用的上一版本镜像，跳过回滚。' >&2
    fi
}

handle_interrupt() {
    trap - HUP INT TERM
    if [ "$deployment_started" -eq 1 ]; then
        rollback
    fi
    exit 130
}

trap handle_interrupt HUP INT TERM

pull_image() {
    if docker image inspect "$IMAGE" >/dev/null 2>&1; then
        echo "使用本地镜像：$IMAGE"
        return 0
    fi
    attempt=1
    while ! docker pull "$IMAGE"; do
        if [ "$attempt" -ge "$PULL_ATTEMPTS" ]; then
            echo "镜像拉取失败：$IMAGE（已重试 $PULL_ATTEMPTS 次）" >&2
            return 1
        fi
        delay=$((attempt * 5))
        echo "镜像拉取第 $attempt 次失败，${delay} 秒后重试。" >&2
        sleep "$delay"
        attempt=$((attempt + 1))
    done
}

ensure_nginx() {
    if [ ! -s "$NGINX_CONFIG" ]; then
        echo "找不到云端 Nginx 配置：$NGINX_CONFIG" >&2
        return 1
    fi
    if grep -q 'server_name web.lisfes.cn;' "$NGINX_CONFIG"; then
        echo 'Nginx 已包含 web.lisfes.cn。'
    else
        snippet=$(CDPATH= cd -- "$(dirname "$COMPOSE_FILE")" && pwd)/nginx-web.lisfes.cn.conf
        if [ ! -s "$snippet" ]; then
            echo "找不到 Nginx 片段：$snippet" >&2
            return 1
        fi
        backup="$NGINX_CONFIG.bak-customer-$(date +%Y%m%d%H%M%S)"
        cp "$NGINX_CONFIG" "$backup"
        python3 - "$NGINX_CONFIG" "$snippet" <<'PY'
import pathlib, sys
config, snippet = sys.argv[1:]
text = pathlib.Path(config).read_text(encoding='utf-8')
marker = '\nstream {'
idx = text.find('\nstream {')
if idx < 0:
    raise SystemExit('找不到 stream 块')
head, tail = text[:idx], text[idx:]
lines = head.rstrip().splitlines()
if not lines or lines[-1].strip() != '}':
    raise SystemExit('http 块结束位置不符合预期')
body = '\n'.join(lines[:-1]).rstrip() + '\n\n'
body += pathlib.Path(snippet).read_text(encoding='utf-8').rstrip() + '\n\n}\n'
pathlib.Path(config).write_text(body + tail.lstrip('\n'), encoding='utf-8', newline='\n')
PY
        if ! grep -q 'server_name web.lisfes.cn;' "$NGINX_CONFIG"; then
            echo '未能把 web.lisfes.cn 写入 Nginx 配置，恢复备份。' >&2
            cp "$backup" "$NGINX_CONFIG"
            return 1
        fi
        if ! docker exec "$NGINX_CONTAINER" nginx -t; then
            echo 'Nginx 配置校验失败，恢复备份。' >&2
            cp "$backup" "$NGINX_CONFIG"
            docker exec "$NGINX_CONTAINER" nginx -t || true
            return 1
        fi
        echo "已接入 web.lisfes.cn，备份：$backup"
    fi
    docker exec "$NGINX_CONTAINER" nginx -s reload
}

echo "拉取客户门户镜像：$IMAGE"
pull_image

echo "启动客户门户 $SERVICE"
deployment_started=1
if ! compose up -d --no-deps "$SERVICE"; then
    rollback
    exit 1
fi

elapsed=0
state='starting'
while [ "$elapsed" -lt "$HEALTH_TIMEOUT" ]; do
    state=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$CONTAINER" 2>/dev/null || true)
    case "$state" in
        healthy) break ;;
        exited|dead|unhealthy)
            echo "容器状态：$state" >&2
            rollback
            exit 1
            ;;
    esac
    sleep 5
    elapsed=$((elapsed + 5))
done

if [ "$state" != 'healthy' ]; then
    echo "客户门户健康检查在 ${HEALTH_TIMEOUT} 秒内未通过。" >&2
    rollback
    exit 1
fi

if ! ensure_nginx; then
    rollback
    exit 1
fi

if ! docker exec "$NGINX_CONTAINER" wget -qO- --header="Host: $DOMAIN" http://127.0.0.1/health | grep -qx healthy; then
    echo 'web.lisfes.cn HTTP 健康检查失败。' >&2
    rollback
    exit 1
fi

trap - HUP INT TERM
echo "客户门户部署成功：$IMAGE"
docker image prune -f >/dev/null 2>&1 || true
