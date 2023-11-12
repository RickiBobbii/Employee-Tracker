const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
 

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//START server and database connection
db.connect((err)=> {
  if (err) throw err;
  console.log('Connected to employees_db.');
  //start inquirer function
  startPrompts();
});

//INQUIRER function for the list options
function startPrompts() {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'selections',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
          ],   
      }
    )
    .then((answers) => {
      switch (answers.selections) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          db.end();
          console.log("Exited application");
          break;
      }
    })
}

//TODOS write functions for selections

app.listen(PORT, () =>
    console.log(`Server on port http://localhost:${PORT}`)
);
