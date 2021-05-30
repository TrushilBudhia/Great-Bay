const mysql = require('mysql2');

async function getConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
    
        // Your port, if not 3306
        port: 3306,
    
        // Your username
        user: 'root',
    
        // Be sure to update with your own MySQL password!
        password: 'C0de5t3@m22!',
        database: 'greatBayDB',
    });   
}


module.exports = {
    getConnection
};