import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("play", (table) => {
    table.increments("id").primary();
    table.float("bet_amount").notNullable().defaultTo(0);
    table.integer("game_id").notNullable();
    table.string("wallet").notNullable();
    table.float("withdraw_amount").notNullable().defaultTo(0);
    table.float("balance_change").notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("play");
}
