import * as path from "path";
import * as knex from "knex";

const database = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "src", "database", "database.sqlite3"),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
} as knex.Config;

export = database;
