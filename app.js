'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');

const PORT = process.env.PORT || 3000;

const app = express();
const db = new sqlite3.Database('./db/chinook.sqlite');

app.get('/invoices-per-country', (req, res) => {
  db.all(
    `SELECT
      COUNT(*) AS Count,
      Invoice.BillingCountry AS Country
    FROM Invoice
    GROUP BY BillingCountry
    ORDER BY Count DESC;`,
    (err, data) => {
      if (err) throw err;
      res.send({
        info: "Invoices per Country",
        data:data
      });

    }
  );

});

app.get('/sales-per-year', (req, res) => {
  // console.log(req.query); //{ filter: { year: '2009,2011' } }
  let having = '';
  if (req.query.filter) {
    having = 'HAVING';

    req.query.filter.year
      .split(',')
      .map(y => +y)
      .forEach(y => {
        having += ` year = "${y}" OR`;
      })

    having = having.substring(0, having.length - 3);
  }

  db.all(
      `SELECT count(*) as invoices,
           sum(Total) as total,
           substr(InvoiceDate, 1, 4) as year
      FROM   Invoice
      GROUP BY year
      ${having}`,
    (err, data) => {
      if (err) throw err;
      const roundedData = data.map (function (obj){
        return {
          invoices: obj.invoices,
          year: +obj.year,
          total: +obj.total.toFixed(2)
        }
      })
      res.send({
        info: "Sales per Year",
        data: roundedData
      });

    }
  );

});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})
