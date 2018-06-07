const mysql = require(`mysql`);
const inquirer = require(`inquirer`);

const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: `root`,
    database: `bamazon`
});
connection.connect(err => {
    if (err) throw err;
    customerPortal();
});
var productList = [];

var customerPortal = () => {
    inquirer
        .prompt([{
            name: `department`,
            message: `Which Department would you like to shop in?`,
            type: `list`,
            choices: [
                `Books`,
                `Electronics`,
                `Movies & Video`,
                `Home & Garden`,
                `Apparel`,
                new inquirer.Separator(),
                `I changed my mind, I don't wish to purchase anything.`
            ]
        }])
        .then(selected => {
            switch (selected.department) {
                case `Books`:
                    getProducts(selected.department);
                    break;
                case `Electronics`:
                    getProducts(selected.department);
                    break;
                case `Movies & Video`:
                    getProducts(selected.department);
                    break;
                case `Home & Garden`:
                    getProducts(selected.department);
                    break;
                case `Apparel`:
                    getProducts(selected.department);
                    break;
                case `I changed my mind, I don't want to purchase anything.`:
                    console.log(`Thank you for shopping at Bamazon!`);
                    connection.end();
                    break;
                default:
                    console.log(`Thank you for shopping at Bamazon!`);
                    connection.end();
                    break;
            }
        });
}

var getProducts = deptName => {
    connection.query(`Select * From products Where department_name=?`, [deptName], (err, res) => {
        for (var i = 0; i < res.length; i++) {
            var output = res[i].product_name + `; Price:$` + res[i].price;
            productList.push(output);
        }
        inquirer
            .prompt([{
                    name: `product`,
                    message: `What would you like to buy?`,
                    type: `list`,
                    choices: productList
                },
                {
                    name: `quantity`,
                    message: `How many would you like to purchase?`,
                    validate: value => {
                        if (isNaN(value)) {
                            return false;
                        }
                        return true;
                    },
                    filter: Number
                }
            ])
            .then(purchase => {
                var purchaseQty = purchase.quantity;
                var product_sales;
                var name = purchase.product.split(`;`);
                connection.query(
                    `SELECT * FROM products WHERE ?`, [{
                        product_name: name[0]
                    }], (err, res) => {
                        if (err) throw err;
                        var quanity = res[0].stock_quantity;
                        product_sales = res[0].product_sales;

                        var total = Number(quanity) - Number(purchaseQty);

                        var Price = name[1].split(`$`);
                        var purchaseAmount = Number(Price[1]);
                        var productSale = Number(
                            product_sales + purchaseAmount * purchaseQty
                        );
                        if (total < 0) {
                            console.log(`Sorry not enough inventory`);
                            getProducts(name[0]);
                        } else {
                            connection.query(
                                `Update products SET ? Where ?`, [{
                                        stock_quantity: total,
                                        product_sales: productSale
                                    },
                                    {
                                        product_name: name[0]
                                    }
                                ], (err, res) => {
                                    if (err) throw err;
                                }
                            );
                            console.log(`Thank you, Your total is $${purchaseAmount * purchaseQty}`);
                            inquirer
                                .prompt([{
                                    name: `shopAgian`,
                                    message: `Would you like to make another purchase?`,
                                    type: `confirm`
                                }])
                                .then(yes => {
                                    if (yes.shopAgian) {
                                        productList = [];
                                        customerPortal();
                                    } else {
                                        console.log(`Thank you for your business, come again soon!`);
                                        connection.end();
                                    }
                                });
                        }
                    }
                );
            });
    });
}