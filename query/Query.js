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
        console.log(query[0]);
        let output = []; 
        let id = [];
        for(let i = 0; i < query[0].length; i++){
            id.push(query[0][i].id, query[0][i].dept_name)
            output.push(id);
            // clear array after output push
            id = [];
            
            //id.push(query[0][i].dept_name);
        }
        console.table(['ID', 'Department'], output);
    };

    // function to view all job roles
    async getJobRole(role) {
        //if arg is passed use if to get ID for role ID field when calling addEmployee
        if (role) {
            let query = await db.query(`SELECT id FROM job_roles WHERE role_name = "${role}"`);
            return query[0][0].id;
        };
    };

    // function to get information from db
    async getEmployees(manager) {
        // if arg is passed use if to get ID for manager ID field when calling addEmployee
        if (manager) {
            let query = await db.query(`SELECT id FROM employees WHERE first_name = "${manager[0]}" AND last_name = "${manager[1]}"`);
            return query[0][0].id;
        }

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