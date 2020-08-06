import Knex from "knex";
import database from "../../knexfile";
const db = Knex(database);
export default db;
