const indexR = require("./index");
const usersR = require("./users");
const makeupR = require("./makeup");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/makeup",makeupR);
}