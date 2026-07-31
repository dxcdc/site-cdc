import "dotenv/config";

import "dotenv/config";

const isProduction = process.env.NODE_ENV === "development" ? false : true;

const dbConfig = {
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'postgres',
  dialectOptions: {
    // Mantenha essas opções sempre
    ssl: false,
    keepAlive: true,
    application_name: 'cdc-backend'
  },
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 10000
  },
  define: { timestamps: true }
};

export default dbConfig;
