## 开发

```shell
# 先启动 tauti dev
bun run start
# 再新开一个终端 启动 api server
bun run server.dev
```

## 打包

- 先修改 tauti.config.js 中的 bundle

```json
{
    ...
    "bundle": {
        ...
        # 添加配置
        "externalBin": ["binaries/app"]
        }
    ...
}
```

- 再打包

```shell
bun run build
```
