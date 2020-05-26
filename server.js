//Dependencies
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const inputCheck = require('./utils/inputCheck.js');
const PORT = process.env.PORT || 3001;
const app = express();

//Adding the middleware
app.use(express.urlencoded({ extended:false }));
app.use(express.json());
//Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if(err){
        return console.log(err.message);
    }

    console.log('Connected to the election database');
});


//ROUTES
//===================================================================
//GET

/*
    GET route to get all the data from the candidates table
*/ 
app.get('/api/candidates', (req,res)=>{
    const sql = `SELECT * FROM candidates`;
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

/*
    GET a single candidate
*/
app.get('/api/candidate/:id', (req,res)=>{
    const sql = `SELECT * FROM candidates WHERE id = ?`;
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

/*
    DELETE a candidate
*/
app.delete('/api/candidate/:id', (req,res)=> {
    const sql = `DELETE FROM candidates WHERE id=?`;
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

//POST 
/*
    CREATE a candidate 
*/
app.post('/api/candidate', ({ body },res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors){
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    //ES5 functiom
    db.run(sql, params, function(err,result){
        if(err){
            res.status(400).json({ error: err.message })
        }
        res.json({
                message: 'Success',
                data: body,
                id: this.lastID
        });
    });

});

    
/*
    Routes to handle request that arent supported by this app 
    This will override all other routes hene place it at the last
*/
app.use((req,res) => {
    res.status(404).end();
})


//LISTEN will start the server=======================================
db.on('open', () => { //This will start the server after the db connection
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
