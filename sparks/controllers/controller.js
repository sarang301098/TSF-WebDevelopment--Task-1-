var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { response } = require('express');
var swal = require('sweetalert');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
   auth : {
       user : 'sarangp3010@gmail.com',
       pass : 'sarang30'
   } 
});



var connection = mongoose.connect('mongodb+srv://root:root@banks.sqnju.mongodb.net/Bank?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true}, (err)=>{
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
    app.get('/', async (req, res)=>{
        await res.redirect('/home');
    });

    app.get('/home', async (req, res)=>{
        await res.render('home');
    });

    app.get('/add', async (req, res)=>{
        await res.render('addUser');
     });

    app.get('/transaction', async (req, res)=>{
        await Bankdbmodel.find({}, (err, data)=>{
            if(err) throw err;
            res.render('transaction', {alldata : data});
        }).sort({ name : 1 }); 
    });

    app.get('/transfer/:id', async (req, res)=>{
     
        await Bankdbmodel.find({ _id : req.params.id}, (err, data)=>{
            if(err) throw err;
            res.render('transfer', {alldata : data});
        }); 
    });
    
    app.post('/transaction', urlencodedParser, async (req, res)=>{
       await Bankdbmodel.find({ _id : req.body.id}, async (err, data)=>{
            if(err) throw err;
           await Bankdbmodel.updateOne({ _id : data[0]._id }, {$set : { amount : parseInt(data[0].amount)-parseInt(req.body.amount)}},(err, res)=>{
                if (err) throw err;
            });
        });
       await Bankdbmodel.find({ name : req.body.name}, async (err, data)=>{
            if(err) throw err;
            await Bankdbmodel.updateOne({ _id : data[0]._id }, {$set : { amount : parseInt(data[0].amount)+parseInt(req.body.amount)}},(err, res)=>{
                if (err) throw err;
            });
        });
      
        var mailOption = {
            from : 'sarangp3010@gmail.com',
            to : 'sarangpatel30101998@gmail.com',
            subject : 'The Sparks Foundation',
            html : `<h1>${req.body.amount}</h1>Rs is Successfully Transfer to <h1>${req.body.name}</h1> `,  
        };
      await transporter.sendMail(mailOption, (err, info)=>{
            if(err){
                console.log("EMAIL"+err);
            }
            else{
                console.log('SENT  : '+info.response);
            }
        });
            res.redirect('/transaction');
          
        
    });

    app.get('/transaction/view/:id', (req, res)=>{
        Bankdbmodel.find({ _id : req.params.id }, (err, data)=>{
            if(err) throw err;
            res.render('view', {alldata : data});
        }); 
    });

    app.post('/add', urlencodedParser, async (req, res) => {
        
        let data = JSON.parse(JSON.stringify(req.body));
        console.log(data);
        var adddata = new Bankdbmodel({
            name : data.name,
            email : data.email,
            amount : Number(data.amount),
            active : Boolean(data.active)
        });

        await adddata.save();
       
        res.redirect('/transaction');
    });

    app.get('/delete/:id', async (req,res) => {
        
        await Bankdbmodel.remove({ _id : req.params.id }, async (err, res) => {
            if(err){
                console.log(err);
            }
        });

        res.redirect('/transaction');
    });

    

}
