//imports
const inquirer = require('inquirer');
const Query = require('./query/Query');
const db = require('./db/connection');
const getQuery = new Query();

//role array changes with additions
let roles = [];

//employee array changes with additions
let employees = [];

//department array
let dept = [];

// default screen selections array
var select = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'];




// default function for starting screen
const startScreen = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'What would you like to do?',
                choices: select
            }
        ]).then((res) => {
            if (res.selection === select[0]) 
                getQuery.getEmployees()
                .then(startScreen);
            else if (res.selection === select[1]) 
                createEmployee()
                    .then((obj) => new Query(obj).addEmployee())
                    .then(startScreen);
            else if (res.selection === select[2]) 
                upEmpRole()
                .then((obj) => new Query(obj).updateEmployeeJob())
                .then(startScreen);
            else if (res.selection === select[3]) 
                getQuery.getJobRole()
                .then(startScreen);
            else if (res.selection === select[4]) 
                addRole()
                    .then((obj) => new Query(obj).addJobRole())
                    .then(startScreen);
            else if (res.selection === select[5]) 
                getQuery.getDept()
                .then(startScreen);
            else if (res.selection === select[6]) 
                addDept()
                    .then((obj) => new Query(obj).addDepartment())
                    .then(startScreen);
            else db.end();
        })
}

const createEmployee = async () => {
    //update roles for accurate prompt
    roles = await getQuery.updateRolesArray();
    //update employees for accurate prompt
    employees = await getQuery.updateEmpArray();

    // query to update roles array before adding employee
    // role = getQuery.updateRolesArray().then(() => {
        return inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'Enter first name: ',
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Enter last name: ',
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Select employee role: ',
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Select employee manager',
                        choices: employees
                    }
                ])
    // })
    // query to update employees array before adding manager
    // employee = getQuery.updateEmpArray()

}

const addRole = async () => {
    //updates dept for most current list
    dept = await getQuery.updateDeptArray();
    console.log(dept);

    return inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'role_name',
                        message: 'Enter role name: ',
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'Enter salary: ',
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'Select department for role: ',
                        choices: dept
                    },
                ])
}

const addDept = async () => {
    return inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'dept_name',
                        message: 'Enter department name: ',
                    }
                ])
}

const upEmpRole = async() => {
    //update roles for accurate prompt
    roles = await getQuery.updateRolesArray();
    //update employees for accurate prompt
    employees = await getQuery.updateEmpArray();
    
    return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee to update?',
                        choices: employees
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What will be the new role?',
                        choices: roles
                    },
                ]);
}
startScreen();
