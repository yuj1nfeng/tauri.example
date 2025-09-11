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

- 注意,bunjs 项目中不能出现动态导入,要编译单文件,bunjs的编译暂时不支持动态导入
