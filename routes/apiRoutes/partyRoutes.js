const express = require('express');
const router = express.Router();
const db = require('../../db/database');


//Party route GET all
router.get('/parties', (req,res)=>{
    const sql = `SELECT * FROM parties`;
    const params = [];
    db.all(sql,params, (err,rows)=>{
        if(err){
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});


//Party route GET single
router.get('/party/:id', (req,res)=>{
    const sql = `SELECT * FROM parties WHERE id = ?`;

    const params = [req.params.id];
    db.get(sql, params, (err,row)=>{
        if(err){
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: row
        });
    });
});

//Party DELETE
router.delete('/party/:id', (req,res)=> {
    const sql = `DELETE FROM parties WHERE id=?`;
    const params = [req.params.id];
    db.run(sql, params, function(err,result) {
        if(err){
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Successfully deleted',
            changes: this.changes
        });
    });
});

module.exports = router;
