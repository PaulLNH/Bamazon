const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(err => {
    if (err) throw err;
    userPrompt();
});

var table = new Table({
    head: ['Department ID', 'Department Name', 'Overhead Cost', 'Product Sales', 'Total Profit']
    // colWidths: [100, 200]
});

var userPrompt = () => {
    inquirer.prompt({
            name: "selectUser",
            type: "list",
            message: "Select your access type?",
            choices: [
                "Customer",
                "Manager",
                "Supervisor",
                "Exit Application"
            ]
        })
        .then(user => {
            switch (user.selectUser) {
                case "Customer":
                    console.log("You've selected Customer");
                    customerPortal();
                    break;
                case "Manager":
                    console.log("You've selected Manager");
                    multiSearch();
                    break;
                case "Supervisor":
                    console.log("You've selected Supervisor");
                    rangeSearch();
                    break;
                case "Exit":
                    console.log("You've selected Exit");
                    connection.end();
                    break;
                default:
                    console.log("Thank you for shopping at Bamazon!");
                    connection.end();
                    break;
            }
        });
}

function customerPortal() {
    var query = "SELECT * FROM products";
    var products = [];
    var purchaseQty = 1;
    connection.query(query, (err, res) => {
        for (var i = 0; i < res.length; i++) {
            var newProd = {
                id: res[i].product_id,
                name: res[i].product_name,
                cost: res[i].price,
                category: res[i].department_name,
                index: i
            }
            products.push(newProd);
        }
        inquirer.prompt([{
            name: "productSold",
            type: "list",
            message: "Select a product you'd like to purchase:",
            choices: products
        }, {
            name: "productQuantity",
            type: "input",
            message: "How many would you like to purchase?",
            default: 1,
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        }]).then(answer => {
            var prodSold = products.indexOf(answer.productSold);
            console.log(`${answer.productSold}`);
            console.log(`${prodSold}`);
            console.log(`${products[1].name}`);
            inquirer.prompt({
                    name: "confirmed",
                    type: "confirm",
                    message: `Your order of ${answer.productQuantity}x ${answer.productSold} has been placed! Would you like to make another purchase?`
                })
                .then(buyAgain => {
                    if (buyAgain.confirmed) {
                        customerPortal();
                    } else {
                        userPrompt();
                    }
                });
        });
    });
}

// function manager() {
//     var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//     connection.query(query, function (err, res) {
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].artist);
//         }
//         userPrompt();
//     });
// }

// function supervisor() {
//     // table is an Array, so you can `push`, `unshift`, `splice` and friends
//     table.push(
//         ['First value', 'Second value'], ['First value', 'Second value']
//     );
//     console.log(table.toString());
// }