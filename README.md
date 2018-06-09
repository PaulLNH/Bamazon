# Bamazon - Node.js and SQL CLI Inventory Management System

Bamazon is a command line interface designed for small businesses to act as a point of sale terminal and manage inventory levels.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. Note that this project is a demonstration of Node.js and SQL and is not intended for live deployment at this time.

### Prerequisites

Bamazon uses several dependencies that need to be installed in order to operate.

- [npm inquirer](https://www.npmjs.com/package/inquirer) - Used to allow the user to interact via command line
- [npm mysql](https://www.npmjs.com/package/mysql) - Allows node.js to interact with MySQL
- [npm cli-table](https://www.npmjs.com/package/cli-table) - Creates a unicode-aided table in the command line

### Installing

Clone the repo by openeing your Git Bash terminal and typing in (a directory you wish to house this application): `git clone https://github.com/PaulLNH/Bamazon.git`

Initialize a SQL database by entering the following into MySQL workbench with an active SQL Command Line Interface running locally (or equiviliant):

```
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id integer(11) NOT NULL AUTO_INCREMENT,
product_name varchar(30) NOT NULL,
department_name varchar(30) NOT NULL,
price decimal(10,2) NOT NULL,
stock_quantity INTEGER(11) NOT NULL,
product_sales decimal(10,2),
PRIMARY KEY (`id`)
);

CREATE TABLE department (
department_id integer(11) NOT NULL AUTO_INCREMENT,
department_name varchar(30) NOT NULL,
over_head_costs decimal(10,2) NOT NULL,
primary key (department_id)
);

-- Insert dummy department
Insert Into department (department_name, over_head_costs)
Values ("Electronics", 60000), ("Books", 10000), ("Movies & Video", 20000), ("Home & Garden", 30000), ("Apparel", 15000);

-- Insert dummy products
INSERT INTO products (product_name, department_name, price, stock_quantity)
Values ("PS4", "Electronics", 299, 100), ("Harry Potter Collections", "books", 75, 50), ("The Office The Complete Series ", "Movies & Video", 45, 75),
("Sofa", "Home & Garden", 399, 10), ("Bamazon Firestick", "Electronics", 90, 100), ("Laptop", "Electronics", 800, 50),
("Shirt", "Apparel", 45, 100), ("Javascript for Dummies", "books", 20, 10), ("Primer", "Movies & Video", 20, 10), ("Fridge", "Home & Garden", 600, 10);

SELECT \* FROM products;
```

After the repo has been cloned locally and your MySQL database has been initilized, enter the folder with the following command in terminal: `cd bamazon`

Install the dependencies with the `npm i` command, this works because the package.json is setup with the dependencies needed.

To run the point of sale or "Customer" portal, type in `node customer.js`

To run the inventory management system or "Manager" portal, type in `node manager.js`

To run the department overview system or "Supervisor" portal, type in `node supervisor.js`

**\* ADD A GIF OF THE PROGRAM WORKING IN ALL 3 INSTINCES **

## Running the tests

Run an initial test on the files by entering the following `node customer.js` the select "I changed my mind, I don't wish to purchase anything." to exit. Check the manager portal by entering `node manager.js` into the command line then select "Exit Manager Portal." to exit. Lastly, type `node supervisor.js` into the command line and select "Exit Supervisor Portal." to return to the command prompt.

Assuming you received no errors on any of these files you've concluded the installation test of the Bamazon app.

### Break down into end to end tests

_Running an end to end test on customer.js:_

- Enter `node customer.js` into the command line
- Select the `Books` category
- Select `Javascript for Dummies`
- Type in `100` for "How many would you like to purchase?" and you should receive the "Sorry not enough inventory" error.
- Select `Javascript for Dummies` again
- This time type in `2` for "How many would you like to purchase?", you should see "Thank you, Your total is $40" then a new prompt "Would you like to make another purchase? (Y/n)"
- Type `y` then hit `Enter`, it should bring you back to the main POS menu
- Select `Apparel` and hit `Enter` to select "Shirt; Price: $45", you should receive another successful purchase prompt.
- Type `n` and hit `Enter` and it should promt you with "Thank you for your business, come agian soon!" and it should exit the application and put you into the command line.

_Running an end to end test on manager.js:_

- Enter `node manager.js` into the command line

_Testing the View Products Module:_

- Select the `View Products for Sale` menu item and hit `Enter`
- Select `PS4` and hit `Enter`
- Select `Price:` to test the modification of price
- Type in `275` and hit `Enter`, you should receive a "The price of PS4 has been changed from \$299 to \$275." prompt followed by a "Would you like to return to the main menu? (Y/n)".
- Type `y` and hit `Enter`
- Select the `View Products for Sale` menu item and hit `Enter`
- Select `PS4` and hit `Enter`
- Select `Inventory:` to test the modification of the stock quantity and hit `Enter`
- Type in `1` and hit `Enter` you will be promted with "Would you like to return to the main menu? (Y/n)".
- Hit `Enter` (this should default to `y`)

_Testing the Print Low Inventory Report Module:_

- Select the `Print Low Inventory Report` menu item and hit `Enter`, this should display a table of all items with an inventory level of 5 or less.
- Type `y` and hit `Enter`

_Testing the Add Inventory Module:_

- Select the `Add Inventory` menu item and hit `Enter`
- Select `PS4` and hit `Enter`
- Type in `5` and hit `Enter` you should see the message "5 PS4's have been added. The total quantity is now: 6"
- Press `Enter` to return to the main menu

_Testing the Add New Product Module:_

- Select the `Add New Product` menu item and hit `Enter`
- When promted "What would you like to add?" type `Solo Cups` and hit `Enter`
- When promted "How many would you like to add?" type in `3` and hit `Enter`
- When promted "What is the price?" type in `2.99` and hit `Enter`
- When prompted "What is the Department you would like to add to? (Use arrow keys)" select `Home & Garden` from the list of items and press `Enter`, you should receive the following confirmation message: "You have added 3 Solo Cups's to your Home & Garden department"
- Select `Main Menu` and press `Enter` to return to the main menu

_Testing the Exit feature:_

- Go through each step of the end to end testing again, this time type `n` when promted "Would you like to return to the main menu?" or `Exit Manager Portal` while in the main menu to exit the program. This should result in a clean break back into the command line and close the SQL connection.

## Deployment

Note that this project is a demonstration of Node.js and SQL and is not intended for live deployment at this time.

## Built With

- [Node.js](https://nodejs.org/en/) - An asynchronous event driven JavaScript runtime enviornment designed to build scalable network applications.
- [npm inquirer](https://www.npmjs.com/package/inquirer) - Used to allow the user to interact via command line
- [npm mysql](https://www.npmjs.com/package/mysql) - Allows node.js to interact with MySQL
- [npm cli-table](https://www.npmjs.com/package/cli-table) - Creates a unicode-aided table in the command line

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PaulLNH/f66c363cf5e6014e0a9aa1641a6a0f02) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/PaulLNH/Bamazon/tags).

## Authors

- **Paul Laird** - _Initial work_ - [PaulLNH](https://github.com/PaulLNH)

See also the list of [contributors](https://github.com/PaulLNH/Bamazon/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone who has suggested ideas or theories towards this project
- Inspiration from my good friend [Ryan Holt](https://github.com/draconusdesigns)
- and of course my wife and kids
