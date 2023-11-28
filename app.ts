console.log("Hellow Typescript!");
import express from "express";
import "express-async-errors";
import "./src/db/index";
import { registRoute } from "./src/routes/index";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import { startApp } from "./src/index";
import { registCors } from "./src/routes/handlers";

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

registCors(app);
registRoute(app);

startApp(app);
