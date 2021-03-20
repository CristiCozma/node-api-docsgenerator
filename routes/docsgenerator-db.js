var express = require("express");
var router = express.Router();
var mysql = require("mysql");

/**
 * IMPORTANT: add content type headers to be able to use req.body.*
  headers: {"Content-Type": "application/json"},
 */

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "docsgenerator"
});

/**
 * run this before first USAGE to create members TABLE
 */
router.get("/install", function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `
    CREATE TABLE IF NOT EXISTS persons2 (id INT NOT NULL AUTO_INCREMENT, cnp TEXT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, localitate TEXT NOT NULL, numar SMALLINT NOT NULL, email TEXT NOT NULL, telefon TEXT(10) NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB;
    `;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.release();
      res.redirect("/");
    });
  });
});

/**
 * run this after install to populate with default users the persons2 table
 */
router.get("/populate", function (req, res, next) {
  console.log(req);
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `
    INSERT INTO persons2 (id, cnp, firstName, lastName, localitate, numar, email, telefon) VALUES (NULL, '1870109260036', 'Cristian', 'Cozma', 'Cluj-Napoca', '32', 'test@gmail.com', '0547821458'), (NULL, '2901112265544', 'Simona', 'Glodean', 'Oradea', '42', 'simona.test@gmail.com', '0478512489'), (NULL, '2870109260036', 'Reka', 'Kovacs', 'Covasna', '32', 'reka.test@gmail.com', '0762485719');
    `;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.release();
      res.redirect("/");
    });
  });
});

/**
 *
 */
router.get("/", function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `SELECT id, cnp, firstName, lastName, localitate, numar, email, telefon FROM persons2  limit 10`;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.release();
      res.json(results);
    });
  });
});

router.get("/person", function (req, res, next) {
  const cnp = req.query.cnp;
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `SELECT * FROM persons2 WHERE cnp=?`;
    connection.query(sql, [cnp], function (err, results) {
      if (err) throw err;
      connection.release();
      res.json(results);
    });
  });
});

/**
 *
 */
router.post("/create", function (req, res, next) {
  const cnp = req.body.cnp;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const localitate = req.body.localitate;
  const numar = req.body.numar;
  const email = req.body.email;
  const telefon = req.body.telefon;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `INSERT INTO persons2 (cnp, firstName, lastName, localitate, numar, email, telefon ) VALUES (${cnp}, '${firstName}', '${lastName}', '${localitate}', '${numar}', '${email}', '${telefon}');`;
    connection.query(sql, [cnp, firstName, lastName, localitate, numar, email, telefon ], function (err, results) {
      if (err) throw err;
      const id = results.insertId;
      connection.release();
      res.json({
        success: true,
        id
      });
    });
  });
});

/**
 *
 */
router.delete("/delete", function (req, res, next) {
  const id = req.body.id;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `DELETE FROM members WHERE id=?`;
    connection.query(sql, [id], function (err, results) {
      if (err) throw err;
      connection.release();
      res.json({ success: true });
    });
  });
});

/**
 *
 */
router.put("/update", function (req, res, next) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const cnp = req.body.cnp;
  const localitate = req.body.localitate;
  const numar = req.body.numar;
  const email = req.body.email;
  const telefon = req.body.telefon;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `UPDATE persons2 SET firstName='${firstName}', lastName='${lastName}', localitate='${localitate}', numar='${numar}', email='${email}', telefon='${telefon}' WHERE cnp='${cnp}'`;
    connection.query(sql, [firstName, lastName, cnp, localitate, numar, email,  telefon], function (err, results) {
      if (err) throw err;
      connection.release();
      res.json({ success: true });
    });
  });
});

module.exports = router;
