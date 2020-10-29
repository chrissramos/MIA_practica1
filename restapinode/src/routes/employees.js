const express = require('express');
const mysqlConnection = require('../database');
const router = express.Router();



/*
router.get('/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM employees WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});*/

router.get('/consulta2', (req, res) => {
    mysqlConnection.query('SELECT salary  FROM employees', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

router.get('/consulta1', (req, res) => {
    mysqlConnection.query('SELECT name  FROM employees', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

module.exports = router;