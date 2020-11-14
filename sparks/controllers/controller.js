var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { response } = require('express');
var swal = require('sweetalert');
var connection = mongoose.connect('mongodb://localhost:27017/Bank', {useUnifiedTopology: true, useNewUrlParser: true}, (err)=>{
    if(err){
        console.log("Error:   "+err);
    }
    else{
        console.log("Connected");
    }
});


const BankSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    amount :{
        type : Number,
        required : true
    },
    active : {
        type : Boolean,
        default : true
    }
});


var Bankdbmodel = mongoose.model("Bankdb", BankSchema);

/*const createdata = async ()=>{
    try{
        
        var data = new Bankdbmodel({
            name : "AAA",
            email : "AAAAA",
            amount : 10000,
            active : false
        });

        const result = await data.save();
        console.log(result);
    }
    catch(err){
        console.log(err);
    }
}
*/
var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = function(app){
    app.get('/', (req, res)=>{
        res.redirect('/home');
    });

    app.get('/home', (req, res)=>{
        res.render('home');
    });

    app.get('/transaction',  (req, res)=>{
        Bankdbmodel.find({}, (err, data)=>{
            if(err) throw err;
            res.render('transaction', {alldata : data});
        }); 
    });

    app.get('/transfer/:id', (req, res)=>{
     
        Bankdbmodel.find({ _id : req.params.id}, (err, data)=>{
            if(err) throw err;
            res.render('transfer', {alldata : data});
        }); 
    });
    
    app.post('/transaction', urlencodedParser, (req, res)=>{
        Bankdbmodel.find({ _id : req.body.id}, (err, data)=>{
            if(err) throw err;
            Bankdbmodel.updateOne({ _id : data[0]._id }, {$set : { amount : parseInt(data[0].amount)-parseInt(req.body.amount)}},(err, res)=>{
                if (err) throw err;
            });
        });
        Bankdbmodel.find({ name : req.body.name}, (err, data)=>{
            if(err) throw err;
            Bankdbmodel.updateOne({ _id : data[0]._id }, {$set : { amount : parseInt(data[0].amount)+parseInt(req.body.amount)}},(err, res)=>{
                if (err) throw err;
            });
        });
        swal("Deleted!", "Your imaginary file has been deleted!", "success");
        res.redirect('/transaction');
    });
  

    

    app.get('/transaction/view/:id', (req, res)=>{
        Bankdbmodel.find({ _id : req.params.id }, (err, data)=>{
            if(err) throw err;
            res.render('view', {alldata : data});
        }); 
    });

}
