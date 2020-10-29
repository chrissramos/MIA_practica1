const express = require('express');
const app = express();

//settings
app.set('port', process.env.PORT ||3000);

//middlewares
app.use(express.json());


//routes 
app.use(require('./routes/practica1'));

//server config
app.listen(app.get('port'), () =>{
    console.log('server on port 3k');
});