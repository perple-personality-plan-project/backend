export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    userName: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    schema: process.env.DATABASE_SCHEMA,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    dialect: process.env.DIALECT,
  },
});
