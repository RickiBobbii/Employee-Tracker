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
          console.log("Exited application");
          process.exit();
      }
    })
}

//TODOS write functions for selections

//Function to view all departments
function viewAllDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) throw err;
    console.table(results);
    startPrompts();
  });
}

//Function to view all roles
function viewAllRoles() {
  db.query(`SELECT roles.title, roles.id, department.department_name, roles.salary FROM roles INNER JOIN department ON roles.department_id = department.id`,
   function (err, results) {
    if (err) throw err;
    console.table(results);
    startPrompts();
  });
}

//Function to View all employees
function viewAllEmployees() {
  db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, 
  CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e 
  JOIN roles r ON e.roles_id = r.id 
  JOIN department d ON r.department_id = d.id 
  LEFT JOIN employee m ON e.manager_id = m.id
  ORDER BY e.id`, 
  function (err, results) {
    if (err) throw err;
    console.table(results);
    startPrompts();
  });
}

//Function to Add a department


app.listen(PORT, () =>
    console.log(`Server on port http://localhost:${PORT}`)
);
