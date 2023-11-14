console.log("Hellow Typescript!");
import express from "express";
require("express-async-errors");
import "./src/db/index";
import { registRoute } from "./src/routes/index";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = 8000;

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

registRoute(app);

app.listen(port, "0.0.0.0", () => {
  console.log("app listening at", "http://localhost:" + port);
});
