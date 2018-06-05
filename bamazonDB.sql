DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
  product_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INTEGER(11) NOT NULL,
  product_sales DECIMAL (10,2),
  PRIMARY KEY (product_id)
);

CREATE TABLE departments(
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  overhead_cost DECIMAL (10,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Kids 4wheeler ATV camo battery powered', 'Electronics', 225, 4),
('Kayak', 'Sporting Goods', 500, 12),
('Bose Noise Canceling Headphones', 'Electronics', 350, 9),
('HP Spectre Laptop', 'Electronics', 1200, 7);

INSERT INTO departments (department_name, overhead_cost) 
VALUES ('Electronics', 20000),
('Sporting Goods', 50000);


SELECT * FROM products;
SELECT * FROM departments;