/**
 * Usage example:
 * 
 * npm run models-dev -- --db=digimond table1 table2
 * 
 * db: Select from available database configurations (e.g., digimond, php_ms_login, aiopms)
 * table1 table2: Optional list of specific tables to generate models for
 */

const path = require("path");
const SequelizeAuto = require('sequelize-auto');
const dotenv = require("dotenv");

// Function to convert names to camelCase
const toCamelCaseName = (str) => {
  return str
    .toLowerCase()
    .replace(/_(.)/g, (_, match) => match.toUpperCase());
};

// Parse command-line arguments
const args = process.argv.slice(2);
const dbArg = args.find(arg => arg.startsWith('--db='))?.split('=')[1] || 'digimond'; // Default to 'DIGIMOND'
const envArg = args.find(arg => arg.startsWith('--env='))?.split('=')[1] || '../env/.env.dev'; // Default to '../env/.env.dev'
const tables = args.filter(arg => !arg.startsWith('--db=') && !arg.startsWith('--env='));
const tablesToGenerate = tables.length > 0 ? tables : undefined; // Default set to undefined to generate all table

// Load environment variables from the specified .env file
dotenv.config({ path: path.join(__dirname, envArg) });

// Function to get database configuration based on the environment
const getDbConfig = (env) => {
  const config = {
    digimond: {
      name: process.env.MYSQL_DIGIMOND_NAME,
      user: process.env.MYSQL_DIGIMOND_USER,
      pass: process.env.MYSQL_DIGIMOND_PASS,
      host: process.env.MYSQL_DIGIMOND_HOST,
      port: process.env.MYSQL_DIGIMOND_PORT,
      dialect: process.env.MYSQL_DIGIMOND_DIALECT
    },
    php_ms_login: {
      name: process.env.MSSQL_USER_NAME,
      user: process.env.MSSQL_USER_USER,
      pass: process.env.MSSQL_USER_PASS,
      host: process.env.MSSQL_USER_HOST,
      port: process.env.MSSQL_USER_PORT,
      dialect: process.env.MSSQL_USER_DIALECT
    },
    aiopms: {
      name: process.env.POSTGRE_PMS_NAME,
      user: process.env.POSTGRE_PMS_USER,
      pass: process.env.POSTGRE_PMS_PASS,
      host: process.env.POSTGRE_PMS_HOST,
      port: process.env.POSTGRE_PMS_PORT,
      dialect: process.env.POSTGRE_PMS_DIALECT
    }
  };

  return config[env] || config.MYSQL; // Default to MYSQL if env is not found
};

// Get database configuration based on the environment
const dbConfig = getDbConfig(dbArg);

// Initialize SequelizeAuto
const auto = new SequelizeAuto(
  dbConfig.name,  // Database name
  dbConfig.user,  // User
  dbConfig.pass,  // Password
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    directory: path.join(__dirname, '../src/models/', toCamelCaseName(dbConfig.name)), // Specify the models directory
    port: dbConfig.port,
    caseModel: 'c', // Camelcase model name
    caseFile: 'c', // Camelcase file name
    singularize: false,
    additional: {
      timestamps: false // Disable timestamps
    },
    noInitModels: true, // Don't initialize models
    tables: tablesToGenerate // Specify tables to generate models for
  }
);

// Run SequelizeAuto and handle results
auto.run().then(data => {
  // Uncomment to debug
  // console.log(data.tables);      // Table and field list
  // console.log(data.foreignKeys); // Table foreign key list
  // console.log(data.indexes);     // Table indexes
  // console.log(data.hasTriggerTables); // Tables with triggers
  // console.log(data.relations);   // Relationships between models
  // console.log(data.text)         // Text of generated models
  console.log('Models generated successfully!');
});
