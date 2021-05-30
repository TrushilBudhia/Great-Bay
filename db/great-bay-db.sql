DROP DATABASE IF EXISTS greatBay_db;
CREATE DATABASE greatBay_db;
CREATE TABLE greatBay_db.itemsForAuction (
  id INT NOT NULL AUTO_INCREMENT,
  itemName VARCHAR(30),
  quantity INT,
  bid DECIMAL (6, 2),
  buyOut DECIMAL (6, 2),
  PRIMARY KEY (id)
);

