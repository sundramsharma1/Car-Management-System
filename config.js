const mongoose = require("mongoose");
require('dotenv').config();
const URI = process.env.MONGODB_URI;
const connect = mongoose.connect(URI);
if (!URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1); // Exit the application with an error code
  }
  async function connectToDatabase() {
    try {
      await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error.message);
      process.exit(1); 
    }
  }
  connectToDatabase();

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
