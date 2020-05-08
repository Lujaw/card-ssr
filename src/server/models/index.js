import Sequelize from "sequelize";
const env = process.env.NODE_ENV || "development";
const config = require("../config/database.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username,
    config.password, config);
}

const modules = [require("./card.js")];

modules.forEach((module) => {
  const model = module(sequelize, Sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
