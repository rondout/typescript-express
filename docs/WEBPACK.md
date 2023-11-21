# 使用 webpack 打包 express 应用

## 安装 webpack 依赖

```cmd
pnpm add webpack webpack-cli -D
```

## 初始化配置

可以使用命令 `webpack init` 初始化配置或者直接自己创建 `webpack.config.js` 文件和增加 `npm` 脚本：
下面是 `npm 脚本` 和 `webpack.config.js` 配置：

```js
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./app.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  target: "node",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
```

`npm 脚本配置`：

```json
"scripts": {
    "dev": "nodemon",
    "build": "webpack --mode=development",
    "build:dev": "webpack --mode=development",
    "build:prod": "webpack --mode=production --node-env=production",
    "watch": "webpack --watch",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
