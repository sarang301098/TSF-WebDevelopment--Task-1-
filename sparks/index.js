var express = require('express');
var controller = require('./controllers/controller');


var app = express();


app.set('view engine', 'ejs');

app.use(express.static('./styles'));


controller(app);


app.listen(3000, ()=>{
    console.log('3000 is Activated');
});