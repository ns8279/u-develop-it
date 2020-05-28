/* 
    Dependencies
    =======================================================================================
*/

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

/*
    Importing necessary files
*/
const db = require('./db/database.js');
const  bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');

//Adding the middleware=====================================================================
app.use(express.urlencoded({ extended:false }));
app.use(express.json());
app.use('/api', apiRoutes); //By adding /api prefix, we can remove it from the individual route expression once its moved to their respective js file
//app.use(bodyParser.json());
    
/*
    Routes to handle request that arent supported by this app 
    This will override all other routes hene place it at the last
*/


app.use((req,res) => {
    res.status(404).end();
})


//LISTEN will start the server================================================================
db.on('open', () => { //This will start the server after the db connection
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
