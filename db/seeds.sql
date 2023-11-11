INSERT INTO department(department_name)
VALUES ('Management'),
       ('Sales'),
       ('Accounting'),
       ('Product Oversight'),
       ('Reception'),
       ('Temps'),
       ('Warehouse'),
       ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES ('Regional Manager', 105000.00, 1),
       ('Sales Representative', 65000.00, 2),
       ('Accountant', 55000.00, 3),
       ('QA Representative', 55000.00, 4),
       ('Receptionist', 40000.00, 5),
       ('Temp', 45000.00, 6),
       ('Warehouse Foreman', 75000.00, 7),
       ('HR Representative', 48000.00, 8);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES  ('Michael', 'Scott', 1, 1),
        ('Karen', 'Filippelli', 1, 2),
        ('Jim', 'Halpert', 2, 3),
        ('Dwight', 'Schrute', 2, 3),
        ('Phyllis', 'Lapin-Vance', 2, 3),
        ('Stanley', 'Hudson', 2, 3),
        ('Andy', 'Bernard', 2, 3),
        ('Angela', 'Martin', 3, 3),
        ('Kevin', 'Malone', 3, 3),
        ('Oscar', 'Martinez', 3, 3),
        ('Meredith', 'Palmer', 4, 3),
        ('Kelly', 'Kapoor', 4, 3),
        ('Creed', 'Bratton', 4, 3),
        ('Pam', 'Beesly', 5, 4),
        ('Erin', 'Hannon', 5, 4),
        ('Ryan', 'Howard', 6, 5),
        ('Darryl', 'Philbin', 7, 3),
        ('Holy', 'Flax', 8, 3),
        ('Tody', 'Flenderson', 8, 3);