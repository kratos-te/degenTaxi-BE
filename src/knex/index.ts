import knex, { Knex } from "knex";
//@ts-ignore-next-line
import knexConfig from "../knexfile";

/**
 * Global is used here to ensure the connection
 * is cached across hot-reloads in development
 *
 * see https://github.com/vercel/next.js/discussions/12229#discussioncomment-83372
 */
//@ts-ignore-next-line
let cached = global.pg;
//@ts-ignore-next-line
if (!cached) cached = global.pg = {};

export function getKnex(): Knex {
  // TODO: return the correct environment config
  if (!cached.instance) cached.instance = knex(knexConfig);
  return cached.instance;
}
