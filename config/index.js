let config = {
  admin: {
    username: "",
    password: "",
    name: ""
  },
  jwt: {
    secret: "secret",
    exprisesIn: "3600s" //以秒为单位
  },
  mongodb: {
    host: "127.0.0.1",
    database: "blog",
    port: 27017,
    user: "", //非必填
    password: "" //非必填
  },
  app: {
    port: process.env.PORT || 3001,
    routerBaseApi: "/api"
  }
};

module.exports = config;
