const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://sundramsharma12244:Stark@cluster.snffesp.mongodb.net/car?retryWrites=true&w=majority&appName=Cluster");

connect.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Database cannot be connected");
});


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


const LoginModel = mongoose.model("users", LoginSchema);


const SignupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

});

const SignupModel = mongoose.model("signups", SignupSchema);

const CarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    manufactureYear: {
        type: Number,
        required:true
    },
})

const CarModel = mongoose.model("cars", CarSchema);

module.exports = { LoginModel, SignupModel, CarModel };
