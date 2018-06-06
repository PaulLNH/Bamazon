const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
const Table = require(`cli-table`);
const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: `root`,
    database: `bamazon`
});

connection.connect(err => {
    if (err) throw err;
    managerPortal();
});

var products = [];
var LowProductQuantity = [];

var managerPortal = () => {
    inquirer
        .prompt([{
            name: `menu`,
            message: `What would you like to do?`,
            type: `list`,
            choices: [
                `View Products for Sale`,
                `Print Low Inventory Report`,
                `Add Inventory`,
                `Add New Product`,
                new inquirer.Separator(),
                `Exit Manager Portal.`
            ]
        }])
        .then(manager => {
            switch (manager.menu) {
                case `View Products for Sale`:
                    getProducts();
                    break;
                case `Print Low Inventory Report`:
                    lowInventory();
                    break;
                case `Add Inventory`:
                    addToInventory()
                    break;
                case `Add New Product`:
                    addNewProduct();
                    break;
                case `Exit Manager Portal.`:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
                default:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
            }
        });
}

var addNewProduct = () => {
    inquirer
        .prompt([{
                name: `add`,
                message: `What would you like to add?`
            },
            {
                name: `qty`,
                message: `How many would you like to add?`,
                validate: value => {
                    if (isNaN(value)) {
                        return false;
                    }
                    return true;
                }
            },
            {
                name: `price`,
                message: `What is the price?`,
                validate: value => {
                    if (isNaN(value)) {
                        return false;
                    }
                    return true;
                }
            },
            {
                name: `department`,
                message: `What is the Department you would like to add to?`,
                type: `list`,
                choices: [
                    `Electronics`,
                    `Books`,
                    `Movies & Video`,
                    `Home & Garden`,
                    `Apparel`
                ]
            }
        ])
        .then(newProduct => {
            var product = newProduct.add;
            var quantity = Number(newProduct.qty);
            var price = Number(newProduct.price);
            var department = newProduct.department;
            connection.query(
                `INSERT INTO products SET ?`, [{
                    product_name: product,
                    department_name: department,
                    price: price,
                    stock_quantity: quantity
                }], (err, res) => {
                    console.log(`You have added ${quantity} ${product}'s to your ${department} department`);
                    setTimeout(addMore, 1000);
                }
            );
        });
}

var addToInventory = () => {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            products.push(`${res[i].product_name}, Quantity: ${res[i].stock_quantity}`);
        }

        inquirer
            .prompt([{
                    name: `addInventory`,
                    message: `Select Product to add Inventory`,
                    type: `list`,
                    choices: products
                },
                {
                    name: `howMany`,
                    message: `How many would you lke to add?`,
                    validate: value => {
                        if (isNaN(value)) {
                            return false;
                        }
                        return true;
                    }
                }
            ])
            .then(answer => {
                var test = answer.addInventory.split(`,`);
                var Inventory;
                var product = test[0];

                var howMany = Number(answer.howMany);
                connection.query(
                    `SELECT * FROM products WHERE product_name=?`, [product], (err, res) => {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            Inventory = res[i].stock_quantity;
                        }
                        var total = Inventory + howMany;
                        connection.query(`Update products SET ? Where ?`, [{
                                stock_quantity: total
                            },
                            {
                                product_name: product
                            }
                        ], (err, res) => {
                            if (err) throw err;
                            console.log(`${howMany} ${product}'s have been added. The total quantity is now: ${total}`);
                            products = [];
                            LowProductQuantity = [];
                            setTimeout(returnToTheMainMenu, 1000);
                        });
                    }
                );
            });
    });
}

var lowInventory = () => {
    var tableLI = new Table({
        head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'QTY']
    });
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                tableLI.push([res[i].id, res[i].product_name, res[i].department_name, `$${res[i].price}`, res[i].stock_quantity]);
            }
        }
        if (tableLI.length !== 0) {
            console.log(tableLI.toString());
            setTimeout(returnToTheMainMenu, 1000);
        } else {
            console.log(`There are currently no items with low quantity.`);
            setTimeout(returnToTheMainMenu, 1000);
        }
    });
}

var getProducts = () => {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            products.push(res[i].product_name);
            if (res[i].stock_quantity < 5) {
                LowProductQuantity.push(`Product: ${res[i].product_name}, Quantity: ${res[i].stock_quantity}`);
            }
        }
        inquirer
            .prompt([{
                name: `products`,
                message: `Click each product for more info.`,
                type: `list`,
                choices: products
            }])
            .then(answer => {
                productInfo(answer.products);
            });
    });
}

var productInfo = (item) => {
    var price;
    var quantity;
    connection.query(
        `Select * From products Where product_name=?`, [item], (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                price = res[i].price;
                quantity = res[i].stock_quantity;
            }
            inquirer
                .prompt([{
                        name: `edit`,
                        message: `Click on Price or Inventory to change`,
                        type: `list`,
                        choices: [`Price: $${price}`, `Inventory: ${quantity}`]
                    },
                    {
                        name: `changeTo`,
                        message: `What do you want to change it to?`,
                        validate: value => {
                            if (isNaN(value)) {
                                return false;
                            }
                            return true;
                        }
                    }
                ])
                .then(answer => {
                    if (answer.edit === `Price: $${price}`) {
                        connection.query(`Update products SET ? Where ?`, [{
                            price: answer.changeTo
                        }, {
                            product_name: item
                        }], (err, res) => {
                            if (err) throw err;
                            console.log(`The price of ${item} has been changed from $${price} to $${answer.changeTo}.`);
                            setTimeout(returnToTheMainMenu, 1000);
                        });
                    } else if (`Inventory: ${quantity}`) {
                        connection.query(`Update products SET ? Where ?`, [{
                            stock_quantity: answer.changeTo
                        }, {
                            product_name: item
                        }], (err, res) => {
                            if (err) throw err;
                            console.log(`The inventory amount of ${item} has been changed from ${quantity} to ${answer.changeTo}.`);
                            setTimeout(returnToTheMainMenu, 1000);
                        });
                    }
                });
        }
    );
}

var returnToTheMainMenu = () => {
    inquirer
        .prompt([{
            name: `MainMenu`,
            message: `Would you like to return to the main menu?`,
            type: `confirm`
        }])
        .then(answer => {
            if (answer.MainMenu) {
                managerPortal();
            } else {
                console.log(`Thank you.`);
                connection.end();
            }
        });
}

var addMore = () => {
    inquirer
        .prompt([{
            name: `menu`,
            message: `Would you like to add more products or return to the main menu?`,
            type: `list`,
            choices: [
                `Main Menu`,
                `Add More`,
                new inquirer.Separator(),
                `Exit Manager Portal.`
            ]
        }])
        .then(addProduct => {
            switch (addProduct.menu) {
                case `Main Menu`:
                    managerPortal();
                    break;
                case `Add More`:
                    addNewProduct();
                    break;
                case `Exit Manager Portal.`:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
                default:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
            }
        });
}