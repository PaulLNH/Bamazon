var mysql = require(`mysql`);
var inquirer = require(`inquirer`);
var Table = require(`cli-table`);

const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: `root`,
    database: `bamazon`
});
connection.connect(err => {
    if (err) throw err;
    superVisor();
});

var superVisor = () => {
    inquirer
        .prompt([{
            name: `route`,
            message: `What would you like to do?`,
            type: `list`,
            choices: [
                `View Product Sales by Department`,
                `Create New Department`,
                new inquirer.Separator(),
                `Exit Supervisor Portal.`
            ]
        }])
        .then(answer => {
            switch (answer.route) {
                case `View Product Sales by Department`:
                    viewProducts();
                    break;
                case `Create New Department`:
                    addDept();
                    break;
                case `Exit Supervisor Portal.`:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
                default:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
            }
        });
};

var viewProducts = () => {
    var query = `SELECT d.department_id, d.department_name, d.over_head_costs, COALESCE( SUM(p.product_sales), 0) as ProductSales
                , COALESCE( SUM(p.product_sales), 0) - d.over_head_costs AS total_profit 
                FROM department as d 
                LEFT JOIN products as p ON p.department_name=d.department_name 
                group by d.department_name 
                order by d.department_id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        // console.log(JSON.stringify(res));
        var table = new Table({
            head: [
                `ID`,
                `Department`,
                `Over Head Costs`,
                `Product Sales`,
                `Total Profits`
            ]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([
                res[i].department_id,
                res[i].department_name,
                `$${res[i].over_head_costs}`,
                `$${res[i].ProductSales}`,
                `$${res[i].total_profit}`
            ]);
        }
        console.log(`\n${table.toString()}`);
        superVisor();
    });
};

var addDept = () => {
    inquirer
        .prompt([{
                name: `new`,
                message: `What would you like to name the new department?`
            },
            {
                name: `costs`,
                message: `How much over head costs are associated with this department?`,
                validate: value => {
                    if (isNaN(value)) {
                        return false;
                    }
                    return true;
                }
            }
        ]).then(answers => {
            var departmentName = answers.new;
            var costs = Number(answers.costs);
            connection.query(
                `INSERT INTO department SET ?`, [{
                    department_name: departmentName,
                    over_head_costs: costs
                }],
                (err, res) => {
                    if (err) throw err;
                    console.log(
                        `You have added ${departmentName} as a new department with an overhead of $${costs}`
                    );
                    addMore();
                }
            );
        });
};

var addMore = () => {
    inquirer
        .prompt([{
            name: `addMore`,
            message: `Would you like to add another department or return to the main menu?`,
            type: `list`,
            choices: [
                `Main Menu`,
                `Add More Departments`,
                new inquirer.Separator(),
                `Exit Supervisor Portal.`
            ]
        }]).then(answer => {
            switch (answer.addMore) {
                case `Main Menu`:
                    superVisor();
                    break;
                case `Add More Departments`:
                    addDept();
                    break;
                case `Exit Supervisor Portal.`:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
                default:
                    console.log(`Thank you.`);
                    connection.end();
                    break;
            }
        });
};