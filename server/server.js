require ('./config/config');
const express = require ('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


// cada vez que veamos un app.use , esto son middlewares (funciones se se dispara al pasar por aqui el codigo. 

// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require ('./routes/usuario' ));


mongoose.connect(process.env.URLDB, (err,res) =>{

if(err) throw err;
console.log('Base de datos ON LINE');

});



app.listen (process.env.PORT, ()=>{

   console.log('Escuchando puerto: ', process.env.PORT);
   
});
