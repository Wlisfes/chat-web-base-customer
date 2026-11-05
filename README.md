# chat-web-base-customer

客户门户。NestJS 只做 Vue3 服务端渲染，不提供接口、Swagger 或业务中间件。

接口走现有 `chat-web-gateway-service`。管理端在 `chat-web-base-manager`。

## 目录

```text
apps/web-client-ssr-server   SSR 入口，开发态挂 Vite
server                       环境变量和 SSR 渲染替换
web                          Vue3 页面、请求、cookie 和环境变量注入
env                          .env.development / .env.production
```

`AssetMiddleware` 只负责把 Vite 或构建后的静态资源接到 SSR 前面，不是接口中间件。

## 启动

```bash
yarn install
yarn dev
```

SSR：http://localhost:5480

## 构建

```bash
yarn build
yarn start
```