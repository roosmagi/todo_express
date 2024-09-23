const { rejects } = require("assert")
const express = require("express")
const app = express()
const fs = require('fs')
const path = require("path")
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            } 
            // tasks list data from file
            const tasks = JSON.parse(data)
            resolve(tasks)
    });
  }) 
}

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        // get data from file
        fs.writeFile(filename, data , "utf-8", err => {
            if (err) {
                console.error(err);
                return;
            } 
            resolve(true)
        }) ;
    })
} 

app.get('/', (req, res) => {
    // tasks list data from file
    readFile('./tasks.json') 
        .then(tasks => {
            console.log(tasks)
            res.render('index', {
                tasks: tasks,
                error: null
            })
    })    
})    

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) =>{
    // control data from form
    let error = null
    if(req.body.task.trim().length == 0){
        error = 'Please insert correct task data'
        readFile("./tasks.json")
        .then(tasks => {
            res.render("index", { 
                tasks: tasks, 
                error: error
            })
        })
    } else { 
    // tasks list data from file
    readFile('./tasks.json')
        .then(tasks => {
            // add new task
            //create new id automatically
            let index
            if(tasks.length === 0 )
           {
            index = 0
           } else {
                index = tasks[tasks.length-1].id + 1;
           } 
           //create task object
           const newTask = {
                "id" : index,
                "task" : req.body.task
           } 
           console.log(newTask)
           // add form sent task to tasks array
           tasks.push(newTask)
           data = JSON.stringify(tasks, null, 2)
           writeFile("tasks.json", data)
            // redirect to / to see results
            res.redirect('/')  
        })
    }
})

app.get("/delete-task/:taskId", (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFile("./tasks.json")
    .then(tasks => {
        tasks.forEach((task, index) => {
            if(task.id === deletedTaskId){
                tasks.splice(index, 1)
            } 
        })
        data = JSON.stringify(tasks, null, 2)
        writeFile("tasks.json", data)
        // redirect to / to see result
        res.redirect("/")
        })
    })
app.get("/delete-all", (req, res) => {
    const data = []
    fs.writeFile("./tasks.json", JSON.stringify(data), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Deleted all!");
        res.redirect("/")
    });
})

    
app.listen(4004, () => {
    console.log("Example app is started at http://localhost:4004 ")
})