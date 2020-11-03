const { request } = require("express");
const mysql = require("mysql");
require("dotenv").config();
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DP_PORT,
  database: process.env.DP_NAME,
});

function addurl(url, slug) {
  return new Promise((resolve, reject) => {
    const sqlcommand = `insert into urls values('${slug}','${url}');`;
    con.query(sqlcommand, (err, resault) => {
      if (err) throw err;
      if (resault["affectedRows"] > 0) {
        console.log("inserted");
        resolve(slug);
      }
    });
  });
}

function geturl(slug) {
  return new Promise((resolve, reject) => {
    sqlcommand = `select url from urls where slug='${slug}';`;
    con.query(sqlcommand, (err, resault) => {
      if (err) throw err;
      if (resault.length < 1) resolve(false);
      else resolve(resault[0]["url"]);
    });
  });
}
// geturl("qu").then((value) => console.log(value));

function exsisting(slug) {
  return new Promise((resolve, reject) => {
    sqlcommand = `select url from urls where slug='${slug}';`;
    con.query(sqlcommand, (err, resault) => {
      if (err) throw err;
      if (resault.length < 1) resolve(false);
      else resolve(true);
    });
  });
}

module.exports.addurl = addurl;
module.exports.geturl = geturl;
module.exports.exsisting = exsisting;
