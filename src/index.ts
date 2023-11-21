import { port } from "./config/config.json";
import { Express } from "express";
// 这里需要注意 chalk只能用 4.x版本的 原因官方文档有解释：
// IMPORTANT: Chalk 5 is ESM. If you want to use Chalk with TypeScript or a build tool, you will probably want to use Chalk 4 for now.
import chalk from "chalk";

/**
 *
 * @param app
 * @description 启动express的Server的方法，这里面需要判断启动报错，如果报错则端口自动+1然后继续尝试启动。
 */
export function startApp(app: Express) {
  let serverPort = port;
  function startListen() {
    try {
      app
        .listen(serverPort, "0.0.0.0", () => {
          console.log(
            "app listening at",
            chalk.underline.blue(`http://localhost:${serverPort}`)
          );
        })
        .on("error", (err) => {
          if (err.message?.includes("EADDRINUSE")) {
            console.log(
              chalk.yellow(
                `port ${serverPort} is used, trying to listen on ${
                  serverPort + 1
                }`
              )
            );
            serverPort++;
          }
          startListen();
        });
    } catch (error) {}
  }
  startListen();
}
