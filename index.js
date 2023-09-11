const mysql = require('mysql2')
const inquirer = require('inquirer');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeeTracker_db'
}, 
console.log('Connected to the employeeTracker_db database.')
);

async function promptUser() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What Would You Like To Do?',
            choices: [
                'View All Employees',
                'View All Departments',
                'View All Roles',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Update Employee Role',
                'Exit'
            ]
        }
    ]);

    //View Functionality

    if(answers.menu === 'View All Employees') {
        viewAllEmployees('SELECT *FROM employee',(err, result) => {
            if(err) throw err
            console.table(result)
        promptUser();
        });
    } else if(answers.menu === 'View All Departments') {
        viewAllDepartments('SELECT *FROM department',(err, result) => {
            if(err) throw err
            console.table(result)
        promptUser();
        });
    } else if(answers.menu === 'View All Roles') {
        viewAllRoles('SELECT *FROM role',(err, result) => {
            if(err) throw err
            console.table(result)
        promptUser();
        });

        //Add Functionality

    } else if(answers.menu === 'Add Employee') {
        const answers = await inquirer.prompt ([
            {
                type:'input', 
                name: 'firstName',
                message: "What Is The New Employee's First Name?"
            },
            {
                type:'input',
                name:'lastName',
                message:"What Is The New Employee's Last Name?"
            },
            {
                type:'input',
                name:'newRole',
                message:"What Is The New Employee's New Role ID?"
            },
            {
                type:'input',
                name:'managerID',
                message: "What Is The New Employee's Manager ID?"
            }
        ])
        addEmployee('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',[answers.firstName, answers.lastName, answers.newRole, answers.managerID], (err,result) => {
            if(err) throw err
            console.table(result)
            promptUser();
        });
    } else if(answers.menu === 'Add Department') {
        const answers = await inquirer.prompt([
            {
                type:'input',
                name:'newDepartment',
                message: 'What Is The New Department?'
            }
        ])
        addDepartment('INSERT INTO department (department_name) VALUES (?)', [answers.newDepartment], (err, result) => {
            if(err) throw err
            console.table(result)
        promptUser();
        });
    } else if(answers.menu === 'Add Role') {
        const answers = await inquirer.prompt ([
            {
                type:'input', 
                name: 'newRole',
                message: "What Is The New Role?"
            },
            {
                type:'input',
                name:'newSalary',
                message:"What Is The Salary For The New Role?"
            },
            {
                type:'input',
                name:'newDepartmentID',
                message:"What Is The Department ID For The New Role?"
            }
        ])
        addRole('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[answers.newRole, answers.newSalary, answers.newDepartmentID], (err,result) => {
            if(err) throw err
            console.table (result)
            promptUser();
        });

        //Update Functionality
    } else if(answers.menu === 'Update Employee Role') {
        const answers = await inquirer.prompt([
            {
                type:'input',
                name:'updateEmployee',
                message:"What Is The Employee's ID?"
            },
            {
                type:'input',
                name:'updateRole',
                message:"What Is The Role ID?"
            }
        ])
        updateEmployeeRole('UPDATE employee SET role_id = ? WHERE id = ?',[answers.updateRole,  answers.updateEmployee], (err, result) => {
            if(err) throw err
            console.table(result)
            promptUser();
        });
    } else {
        db.end();
    }
};