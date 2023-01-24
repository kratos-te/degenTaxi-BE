import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('games', (table) => {
    table.increments('id').primary()
    table.float('random').notNullable().defaultTo(0)
    table.float('bang_at').notNullable().defaultTo(0)
    table.timestamp('start_at').defaultTo(knex.fn.now())
    table.timestamp('end_at').defaultTo(knex.fn.now())
    table.boolean('status').defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('games')
}
