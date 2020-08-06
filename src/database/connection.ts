import Knex from "knex";
import database from "../../knexfile";
export const knex = Knex(database);
