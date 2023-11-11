const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
//const sequelize = require('./config/connection');   

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database before starting the Express.js server
//sequelize.sync().then(() => {
//    app.listen(PORT, () => console.log('Now listening'));
//});

// Connect to database
const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      // MySQL username,
      user: process.env.DB_USER,
      // TODO: Add MySQL password here
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the employees_db database.`)
  );

//Default response for not found request
app.use((req, res) => {
    res.status(404).end();
});
  
app.listen(PORT, () =>
    console.log(`Server on port http://localhost:${PORT}`)
);
