module.exports = {
  client: 'pg',
  connection:
    process.env.DATABASE_URL ||
    'postgres://postgres:root@44.196.246.63:5432/betting-taxi',
  migrations: {
    directory: './knex/migrations',
  },
  seeds: {
    directory: './knex/seeds',
  },
}
