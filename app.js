const Koa = require("koa");
const app = new Koa();
const config = require("./config/index");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const index = require("./routes/index");
const users = require("./routes/users");

// error handler
onerror(app);

// mongoose
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const mongoUrl = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`;
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on("error", () => {
  console.log("数据库连接出错!");
});
db.once("open", () => {
  console.log("数据库连接成功！");
});

//输出请求的方法，url,和所花费的时间
app.use(async (ctx, next) => {
  let start = new Date();
  await next();
  let ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms} ms`);
});

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
