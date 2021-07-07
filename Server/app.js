const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/key');
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
require('./models/user');
require('./models/post');

//convert request to json
app.use(express.json());
app.use(require("./routers/auth"));
app.use(require("./routers/post"));
app.use(require("./routers/user"));

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'));
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
app.listen(PORT, () => {
    console.log("Server is Running");
})