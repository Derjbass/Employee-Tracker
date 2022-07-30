const cTable = require('console.table');
const db = require('../db/connection');

class Query{
    constructor(obj){
        this.obj = obj;
    };

    // function to view all departments
    async getDept(dept) {
        //if arg is passed use if to get ID for department ID field when calling addJobRole
        if (dept) {
            let query = await db.query(`SELECT id FROM departments WHERE dept_name = "${dept}"`);
            return query[0][0].id;
        };

        //query department information
        let query = await db.query('SELECT * from departments');
        let output = []; 
        let id = [];
        for(let i = 0; i < query[0].length; i++){
            id.push(query[0][i].id, query[0][i].dept_name)
            output.push(id);
            // clear array after output push to prevent duplicates
            id = [];
            
            //id.push(query[0][i].dept_name);
        }
        // display data in console
        console.table(['ID', 'Department'], output);
    };

    // function to view all job roles
    async getJobRole(role) {
        //if arg is passed use if to get ID for role ID field when calling addEmployee
        if (role) {
            let query = await db.query(`SELECT * FROM job_roles WHERE role_name = "${role}"`);
            return query[0][0].id;
        };

        //query role information
        let query = await db.query('SELECT * FROM job_roles');
        //query for department name by ID
        let depQuery = await db.query('SELECT * FROM departments');


        let output = []; 
        let id = [];
        for(let i = 0; i < query[0].length; i++){
            // find department name from obj array
            let obj = depQuery[0].find(o => o.id === query[0][i].department_id);
            // job title, role id, department name pushed to array
            id.push(query[0][i].role_name, query[0][i].id, obj.dept_name);
            //push to output array
            output.push(id);
            //reset id array to prevent duplicates
            id = [];
        }
        // display data in console
        console.table(['Role', 'ID', 'Department'], output);
    };

    // function to get information from db
    async getEmployees(manager) {
        // if arg is passed use if to get ID for manager ID field when calling addEmployee
        if (manager) {
            let query = await db.query(`SELECT id FROM employees WHERE first_name = "${manager[0]}" AND last_name = "${manager[1]}"`);
            return query[0][0].id;
        }

        // below will show employee ids, first names, last names, job titles, departments, salaries, and managers name

        let roleQuery = await db.query('SELECT * FROM job_roles');
        let deptQuery = await db.query('SELECT * FROM departments');
        let empQuery = await db.query('SELECT * FROM employees');

        //merge queried data above single array
        let data = [roleQuery[0], deptQuery[0], empQuery[0]];


        let output = []; 
        let id = [];
        let tempArr = [];
        for(let i = 0; i < data[2].length; i++){
            // find manager name from manager id from employee array
            let obj = data[2].find(o => o.id === data[2][i].manager_id)
            //if to make sure only defined managers are pushed to array
            if(obj) {
                tempArr.push(obj.first_name, obj.last_name);
                data[2][i].manager_id = tempArr.join(' ');
            }
            // find department name from department ID
            let objDept = await data[1].find(o => o.id === data[2][i].role_id);
            console.log(objDept);

            // find role name from role id
            let objRole = await data[0].find(o => o.id === data[2][i].role_id);
            console.log(objRole);


            id.push(data[2][i].id, data[2][i].first_name, data[2][i].last_name, objRole.role_name , objDept.dept_name, objRole.salary ,data[2][i].manager_id);

            output.push(id);
            // clear arrays after output push to prevent duplicates
            id = [];
            tempArr = [];
        }
        console.table(['ID', 'First Name', 'Last Name','Role', 'Department', 'Salary', 'Manager'], output);
        
        

    };

    // function to add department
    async addDepartment() {
        return db.query('INSERT INTO departments SET ?', this.obj);
    };
    
    // function to add job role
    async addJobRole() {
        //get dept ID INT from obj string
        this.obj.department_id = await this.getDept(this.obj.department_id);
        return db.query('INSERT INTO job_roles SET ?', this.obj);
    };
    
    // function to add employee to db
    async addEmployee() {
        //get role ID INT from obj String
        this.obj.role_id = await this.getJobRole(this.obj.role_id);
        //get manager ID INT from obj String
        this.obj.manager_id = await this.getEmployees(this.obj.manager_id.split(' '));
        return db.query('INSERT INTO employees SET ?', this.obj);
    };

    // function to update employee job role in db
    async updateEmployeeJob() {
        //get role ID INT from obj String
        this.obj.role_id = await this.getJobRole(this.obj.role_id);
        // get employee first and last name for query readability
        this.obj.employee = await this.obj.employee.split(' ');
       
        //update users new role ID
        await db.query(`UPDATE employees SET role_id = ${this.obj.role_id} WHERE first_name = "${this.obj.employee[0]}" AND last_name = "${this.obj.employee[1]}"`);
    };

    // function to update employee array
    async updateEmpArray() {
        let employee = [];
        let query = await db.query('SELECT first_name, last_name FROM employees');   
        for (let i = 0; i < query[0].length; i++) {
            let tempArr = [query[0][i].first_name, query[0][i].last_name]
            employee.push(tempArr.join(' '));
        }
        return employee;
            
        
    }

    // function to update roles array
    async updateRolesArray() {
        let role = [];
        let query = await db.query('SELECT role_name FROM job_roles');
        for (let i = 0; i < query[0].length; i++) {
            role.push(query[0][i].role_name);
        }
        return role;
    };

    // function to update departments array
    async updateDeptArray() {
        let dept = [];
        let query = await db.query('SELECT dept_name FROM departments');
        for (let i = 0; i < query[0].length; i++) {
            dept.push(query[0][i].dept_name);
        }
        return dept;
            
    }
}


// export
module.exports = Query;