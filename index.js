const express = require("express")
const app = express()
const port = 4009
const fs = require('fs')


const path = require("path")
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
    // get data from file
    fs.readFile('./tasks', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return
        } 
        // tasks list data from file
        const tasks = data.split("\n")
        res.render('index',{tasks: tasks})
    });
})

app.listen(4009, () => {
    console.log("Example app is started at http://localhost:4009")
})