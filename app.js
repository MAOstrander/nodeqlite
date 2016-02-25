'use strict';

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/chinook.sqlite');

console.log('# of invoices per country');

db.all(
  `SELECT
    COUNT(*) AS Count,
    Invoice.BillingCountry AS Country
  FROM Invoice
  GROUP BY BillingCountry
  ORDER BY Count DESC;`,
  (err, res) => {
    if (err) throw err;
    console.log(res);
  }
);
