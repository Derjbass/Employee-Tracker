USE employee_tracker;

INSERT INTO departments (dept_name) VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('legal');

INSERT INTO job_roles (role_name, salary, department_id) VALUES
    ('Sales Lead', 100000, 1),
    ('Lead Engineer', 150000, 2),
    ('Account Manager', 160000, 3),
    ('Legal Team Lead', 250000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Ashley', 'Page', 2, NULL),
    ('Bob', 'Singer', 3, NULL),
    ('Ada', 'Lovelace', 4, NULL);