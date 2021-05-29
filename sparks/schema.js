var mongoose = require('mongoose');

var connection = mongoose.connect('mongodb://localhost:27017/Bank', { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("Error:   " + err);
    }
    else {
        console.log("Connected");
    }
});


const BankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});


var Bankdbmodel = mongoose.model("Bankdb", BankSchema);

const createdata = async () => {
    try {
        var data = new Bankdbmodel({
            name: "AAA",
            email: "AAAAA",
            amount: 10000,
            active: false
        });

        const result = await data.save();
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

var readdata = Bankdbmodel.find();
//module.exports.readdata = readdata;

//createdata();

