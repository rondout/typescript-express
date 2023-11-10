# 使用 typescript + express 创建 NodeJs 后端服务

## 初始化 NodeJs 程序

```bash
npm init -y
```

## 安装依赖

```bash
pnpm add express
pnpm add ts-node nodemon @types/node @types/express -D
```

## 配置 nodemon

在根目录创建`nodemon.json`:

```json
{
  "watch": ["./"],
  "ext": ".ts,",
  "exec": "ts-node app.ts"
}
```

## 配置启动脚本

在 `package.json` 中配置启动脚本：

```json
{
  // /
  "scripts": {
    "dev": "nodemon"
  }
  ///
}
```

由此，一个 `typescript` 版本的 `NodeJs` 工程就搭建好了。然后就开始
