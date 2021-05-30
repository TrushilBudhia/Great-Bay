// Importing the required modules
require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2/promise')

async function promptForItem(auctionItems) {
    const arrayOfItems = auctionItems.map(item => item.itemName);
    const answer = await inquirer.prompt(
        {
            type: 'list',
            message: 'Which item do you wish to bid on?',
            choices: arrayOfItems,
            name: 'itemName'
        }
    );
    console.log('Your chosen item is:', answer.itemName);
    return answer.itemName;
};

async function promptForBid() {
    const answer = await inquirer.prompt(
        {
            type: 'number',
            message: 'How much do you want to bid?',
            name: 'bid'
        }
    );
    console.log('You have bidded: $' + answer.bid);
    return answer.bid;
}

async function getAuctionItems (auctionItems, connection) {

    const chosenItem = await promptForItem(auctionItems);
    const itemBid = await promptForBid();

    const dbEntryForAuctionItem = auctionItems.find(auctionItem => auctionItem.itemName === chosenItem);

    if (itemBid > dbEntryForAuctionItem.bid) {
        console.log('Your bid was successful.');

        try {
            const results = await connection.query(
                "UPDATE itemsForAuction SET bid = ? WHERE itemName = ?",
                [itemBid, chosenItem],
            );
            // console.log("Records updated:", results[0]);
        }
        catch (error) {
            console.error(error);
        }

        connection.end();
    }
    else if (itemBid <= dbEntryForAuctionItem.bid) {
        console.log("Your bid is too low.");
        initiate(connection);    
    }
}

async function initiate(connection) {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            message: 'Would like to POST an item or BID on an item?',
            choices: [
                'POST', 
                'BID'
            ],
            name: 'choice',
        }
    ])

    if (answers.choice === 'POST') {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the item name?',
                name: 'itemName',
            },
            {
                type: 'input',
                message: 'How many do you wish to auction?',
                name: 'itemAmount',
            },
            {
                type: 'input',
                message: 'What is the starting price?',
                name: 'bid',
            },
            {
                type: 'input',
                message: 'What is the buyout price?',
                name: 'buyOut',
            }
        ])

        try {
            const results = await connection.query(
                "INSERT INTO itemsForAuction (itemName, quantity, bid, buyOut) VALUES (?, ?, ?, ?)",
                [answers.itemName, answers.itemAmount, answers.bid, answers.buyOut],
            );
            console.log("Success. Item has been posted.");
            init();
        }
        catch (error) {
            console.error(error);
        }
        connection.end();
    }
    else if (answers.choice === 'BID') {
        try {
            const results = await connection.query(
                "SELECT * FROM itemsForAuction",
            )
            if (results[0].length === 0) {
                console.log("There are no items currently posted.");
                init();
            } else {
                // console.log("All auction items", results[0]);
                getAuctionItems(results[0], connection);
            }
        }
        catch(error) {
            console.error(error);
        }  
    }
}

async function init() {
    //const connection = await getConnection();
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,

        port: process.env.DB_PORT,

        user: process.env.DB_USER,

        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });   
    // console.log(connection);
    initiate(connection);
}

init();