const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Requête de connexion
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// Connexion
connection.connect(error => {
  if (error) throw error;
  console.log("Connecté à la base de données.");
});

module.exports = connection;