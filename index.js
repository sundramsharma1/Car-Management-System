const express = require('express');
const bcrypt = require('bcrypt');
const { LoginModel, SignupModel, CarModel } = require("./config"); 
const { model } = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

// Redirect to Login page initially
app.get("/", (req, res) => {
    res.redirect("/Login");
});

// Render the Signup page
app.get("/Signup", (req, res) => {
    res.render("Signup");
});

// Handle Signup POST request
app.post("/Signup", async (req, res) => {
    try {
        // Validate input data
        if (!req.body.username || !req.body.password) {
            return res.status(400).send("Username and password are required");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
        const data = {
            name: req.body.username,
            password: hashedPassword
        };

        // Save data to the database
        const userdata = await SignupModel.insertMany([data]);
        console.log("User data inserted:", userdata);
        res.redirect("/Login"); // Redirect to the login page
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Error signing up");
    }
});

app.get("/Login", (req, res) => {
    res.render("Login");
});

// Handle Login POST request
app.post("/Login", async (req, res) => {
    try {
        const user = await SignupModel.findOne({ name: req.body.username }); 
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.redirect("/Home");
        } else {
            res.send("Invalid username or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
});

// Handle GET request for Home (render and fetch data)
app.get("/Home", async (req, res) => {
    try {
        const cars = await CarModel.find(); // Fetch all car data
        res.render("Home", { cars }); // Render Home page with car data
    } catch (error) {
        console.error("Error fetching car data:", error);
        res.status(500).send("Error fetching car data");
    }
});

// Handle POST request to add new car
app.post("/Home", async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            manufactureYear: req.body.manufactureYear
        };

        await CarModel.insertMany([data]); // Insert new car data
        console.log("Car data inserted");
        res.redirect("/Home"); // Redirect to the Home page to show updated list
    } catch (error) {
        console.error("Car error:", error);
        res.status(500).send("Error adding car");
    }
});

// Update car data
app.post("/updateCar/:id", async (req, res) => {
    try {
        const carId = req.params.id;
        const updatedData = {
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            manufactureYear: req.body.manufactureYear
        };

        // Update car data in the database
        await CarModel.findByIdAndUpdate(carId, updatedData);

        res.status(200).send("Car updated successfully");
    } catch (error) {
        console.error("Error updating car data:", error);
        res.status(500).send("Error updating car data");
    }
});

// Delete car data
app.post("/deleteCar/:id", async (req, res) => {
    try {
        const carId = req.params.id;

        // Delete car data from the database
        await CarModel.findByIdAndDelete(carId);

        res.status(200).send("Car deleted successfully");
    } catch (error) {
        console.error("Error deleting car data:", error);
        res.status(500).send("Error deleting car data");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
