const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const cfonts = require('cfonts');
 
//Express is here for possible future use
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

//START fancy cfont app
cfonts.say('The Office Database', {
	font: 'block',              // define the font face
	align: 'left',              // define text alignment
	colors: ['system'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: false,            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment cfonts is being executed in
});

//INQUIRER function for the list options
function startPrompts() {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'selections',
        message: 'WHAT WOULD YOU LIKE TO DO?',
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

//Functions for selections below

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
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Please enter a new Department name: ',
      validate: (input)=>{ if(input){return true} else {return 'Please input a Department to continue.'}},
    })
    .then((answers)=> {
      console.log(answers.name);
      db.query(`INSERT INTO department (department_name) VALUES ('${answers.name}')`,
      function (err, res) {
        if (err) throw err;
        console.log(`${answers.name} department has been added to employees_db.`);
        startPrompts();
      })
    })
}

//Function to Add a role

//Query all current Departments, assisted with Bing AI
const queryDepartments = async () => {
  const query = 'SELECT department_name FROM department';
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
};

async function addRole() {
  const choices = await queryDepartments();
  //console.log(choices);
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Please enter a new ROLE name: ',
        validate: (input)=>{ if(input){return true} else {return 'Please input a Role to continue.'}},
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter SALARY for that role: ',
        //Decimal validate function made with help from Bing AI
        validate: (input) => {
          if (input) {
            const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
              if (regex.test(input)) {
                  return true;
              } else {
                  return 'Please input a number with up to 2 decimal places.';
              }
          } else {
              return 'Please input a number to continue.';
          }
        }
      },
      {
        type: 'list',
        name: 'department',
        message: 'Please enter DEPARTMENT for that role: ',
        //MAP choices from current departments
        choices: choices.map((choice)=> choice.department_name)
      }
    ])
    .then((answers)=> {
      //console.log(answers.name);
      const fetchID = async () => {
        const query = `SELECT id FROM department WHERE department_name = '${answers.department}'`;
        return new Promise((resolve, reject) => {
          db.query(query, (error, results) => {
            if (error) reject(error);
            resolve(results);
            //console.log(results);
          });
        });
      };
      //INSERT new role into roles table
      async function departmentID() {
          const deptID = await fetchID();
          //console.log(`department id attempt 1 ${deptID[0].id}`);
          db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.name}', '${answers.salary}', '${deptID[0].id}')`,
            function (err, res) {
              if (err) throw err;
              console.log(`ROLE of ${answers.name} has been added to employees_db!`);
              startPrompts();
            })
      }
      departmentID();
    })
}

//Function to Add an employee
//Query all current Employee Roles
const queryRoles = async () => {
  const query = 'SELECT title FROM roles';
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
};

async function addEmployee() {
  const choices = await queryRoles();
  //console.log(choices);
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first',
        message: 'Please enter a FIRST name: ',
        validate: (input)=>{ if(input){return true} else {return 'Please input a First name to continue.'}},
      },
      {
        type: 'input',
        name: 'last',
        message: 'Please enter a LAST name: ',
        validate: (input)=>{ if(input){return true} else {return 'Please input a Last name to continue.'}},
      },
      {
        type: 'list',
        name: 'role',
        message: 'Please select ROLE for employee: ',
        choices: choices.map((choice)=> choice.title)
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Please select MANAGER for employee: ',
        choices: ['1','2']
      }
    ])
    .then((answers)=> {
      console.log(answers.first, answers.last, answers.role, answers.manager);
      //Fetch id of role 
      const fetchID = async () => {
        const query = `SELECT id FROM roles WHERE title = '${answers.role}'`;
        return new Promise((resolve, reject) => {
          db.query(query, (error, results) => {
            if (error) reject(error);
            resolve(results);
            //console.log(results);
          });
        });
      };
      //Query to insert values into employee table
      async function rolesID() {
          const roleID = await fetchID();
          db.query(`INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ('${answers.first}', '${answers.last}', '${roleID[0].id}','${answers.manager}')`,
            function (err, res) {
              if (err) throw err;
              console.log(`Employee ${answers.first, answers.last} has been added to employees_db!`);
              startPrompts();
            })
      }
      rolesID();
    })
}

//Function to Update an employee role
//reuse queryRoles
const queryEmployees = async () => {
  const query = "SELECT * FROM employee";
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
};
async function updateEmployeeRole() {
  //Employees query list
  const allEmployees = await queryEmployees();
  const choices = await queryRoles();
  //console.log(choices);
  //console.log(allEmployees)
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employees',
        message: 'Please select an Employee: ',
        choices: allEmployees.map((choice)=> choice.first_name + ' ' + choice.last_name)
      },
      {
        type: 'list',
        name: 'role',
        message: 'Please select ROLE for employee: ',
        choices: choices.map((choice)=> choice.title)
      },
      
    ])
    .then((answers)=> {
      //console.log(answers.role);
      //Fetch id of role 
      const fetchID = async () => {
        const query = `SELECT id FROM roles WHERE title = '${answers.role}'`;
        return new Promise((resolve, reject) => {
          db.query(query, (error, results) => {
            if (error) reject(error);
            resolve(results);
            //console.log(results);
          });
        });
      };
      //Query to UPDATE employee Role into employee table
      async function employeesID() {
          const employeeID = await fetchID();
          db.query(`UPDATE employee SET roles_id = '${employeeID[0].id}' WHERE CONCAT(first_name,' ', last_name) = '${answers.employees}'`,
            function (err, res) {
              if (err) throw err;
              console.log(`Employee role has been UPDATED to ${answers.role}!`);
              startPrompts();
            })
      }
      employeesID();
    })
}
//Future optional Express use
// app.listen(PORT, () =>
//     console.log(`Server on port http://localhost:${PORT}`)
// );
