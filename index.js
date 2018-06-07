const inquirer = require(`inquirer`);

var userPrompt = () => {
    inquirer.prompt({
            name: `selectUser`,
            type: `list`,
            message: `Welcome to the Bamazon user portal. Please select your access type.`,
            choices: [
                `Customer`,
                `Manager`,
                `Supervisor`,
                new inquirer.Separator(),
                `Exit Application`
            ]
        })
        .then(user => {
            switch (user.selectUser) {
                case `Customer`:
                    console.log(`Welcome Shopper!`);
                    customerPortal();
                    break;
                case `Manager`:
                    console.log(`You are now logged in as a Manager`);
                    managerPortal();
                    break;
                case `Supervisor`:
                    console.log(`You are now logged in as a Supervisor`);
                    supervisorPortal();
                    break;
                case `Exit Application`:
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
userPrompt();