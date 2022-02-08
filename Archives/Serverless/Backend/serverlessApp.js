const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');



//* IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");



//* DB CONNECTION
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED");
});



//* MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());



//* MY ROUTES
app.use("/api",authRoutes);

//* Test Route
app.get("/test", (req, res) => {
    return res.send("Hello!!!");
})

module.exports = app;