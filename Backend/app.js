const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');



//* IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");



//* DB CONNECTION
mongoose.connect('mongodb://localhost:27017/gms', {
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



//* PORT
const port = process.env.PORT || 7000;
//* STARTING SERVER
app.listen(port, () => {
    console.log(`App is running at ${port}`);
});