CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30)
);

CREATE TABLE job_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments (id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES job_roles (id), 
    FOREIGN KEY (manager_id) REFERENCES employees (id) 
);