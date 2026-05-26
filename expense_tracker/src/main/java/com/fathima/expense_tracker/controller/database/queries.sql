USE expense_tracker;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    monthly_budget DOUBLE DEFAULT 0

);

-- EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255),

    amount DOUBLE,

    category VARCHAR(100),

    expense_date DATE,

    created_by VARCHAR(255),

    group_name VARCHAR(255),

    split_type VARCHAR(100)

);

-- GROUPS TABLE
CREATE TABLE IF NOT EXISTS groups_table (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255),

    created_by VARCHAR(255),

    members TEXT

);

SHOW TABLES;
USE expense_tracker;

SELECT * FROM expenses;
USE expense_tracker;

SELECT * FROM groups_table;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS settlements (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    payer VARCHAR(255),

    receiver VARCHAR(255),

    amount DOUBLE,

    status VARCHAR(100)

);
SHOW TABLES;
USE expense_tracker;


SELECT * FROM settlements;

