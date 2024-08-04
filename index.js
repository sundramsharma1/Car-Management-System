const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { LoginModel, SignupModel, CarModel } = require("./config");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET || "275101", // Use environment variable for secret
    resave: false,
    saveUninitialized: false,
}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

// Prevent caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Middleware to protect routes
function checkAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/Login');
    }
}

// Routes
app.get("/", (req, res) => {
    res.redirect("/Login");
});

app.get("/Signup", (req, res) => {
    res.render("Signup");
});

app.post("/Signup", async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send("Username and password are required");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            name: req.body.username,
            password: hashedPassword
        };

        await SignupModel.insertMany([data]);
        res.redirect("/Login");
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Error signing up");
    }
});

app.get("/Login", (req, res) => {
    res.render("Login");
});

app.post("/Login", async (req, res) => {
    try {
        const user = await SignupModel.findOne({ name: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            res.redirect("/Home");
        } else {
            res.send("Invalid username or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
});

app.get('/Logout', checkAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Error during logout", err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/Login');
    });
});

app.get("/Home", checkAuthenticated, async (req, res) => {
    try {
        const cars = await CarModel.find();
        res.render("Home", { cars });
    } catch (error) {
        console.error("Error fetching car data:", error);
        res.status(500).send("Error fetching car data");
    }
});

app.post("/Home", checkAuthenticated, async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            manufactureYear: req.body.manufactureYear
        };

        await CarModel.insertMany([data]);
        res.redirect("/Home");
    } catch (error) {
        console.error("Car error:", error);
        res.status(500).send("Error adding car");
    }
});

app.post("/updateCar/:id", checkAuthenticated, async (req, res) => {
    try {
        const carId = req.params.id;
        const updatedData = {
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            manufactureYear: req.body.manufactureYear
        };

        await CarModel.findByIdAndUpdate(carId, updatedData);
        res.redirect("/Home");
    } catch (error) {
        console.error("Error updating car data:", error);
        res.status(500).send("Error updating car data");
    }
});

app.post("/deleteCar/:id", checkAuthenticated, async (req, res) => {
    try {
        const carId = req.params.id;
        await CarModel.findByIdAndDelete(carId);
        res.redirect("/Home");
    } catch (error) {
        console.error("Error deleting car data:", error);
        res.status(500).send("Error deleting car data");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
