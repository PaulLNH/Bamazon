const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
// const customerPortal = require(`./customer`);

var userPrompt = () => {
    inquirer.prompt({
            name: `selectUser`,
            type: `list`,
            message: `Welcome to the Bamazon user portal. Please select your access type.`,
            choices: [
                `Customer`,
                `Manager`,
                `Supervisor`,
                `Exit Application`
            ]
        })
        .then(user => {
            switch (user.selectUser) {
                case `Customer`:
                    console.log(`You've selected Customer`);
                    customerPortal();
                    break;
                case `Manager`:
                    console.log(`You've selected Manager`);
                    multiSearch();
                    break;
                case `Supervisor`:
                    console.log(`You've selected Supervisor`);
                    rangeSearch();
                    break;
                case `Exit`:
                    console.log(`Thank you for visiting Bamazon!`);
                    connection.end();
                    break;
                default:
                    console.log(`Thank you for visiting Bamazon!`);
                    connection.end();
                    break;
            }
        });
}