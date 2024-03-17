let Express = require("express");
let Mongoclient = require("mongodb").MongoClient;
let cors = require("cors");
const multer = require("multer");

let app=Express();
app.use(cors());

const uri = "mongodb+srv://<username>:<password>@cluster0.slaft1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let CONNECTION_STRING = "mongodb+srv://admin:vagaFAGEAF32at324_@cluster0.slaft1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
let DATABASENAME = "todoappdb";
let database;

app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client)=>{
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection Successful");
    });
})

app.get('/api/todoapp/GetNotes',(request,response)=>{
    database.collection("todoappcollection").find({}).toArray((error, result)=>{
        response.send(result);
    })
})

app.post('/api/todoapp/AddNotes', multer().none(), (request, response) => {
    database.collection("todoappcollection").count({}, function(error, numOfDocs) {
        database.collection("todoappcollection").insertOne({
            id:(numOfDocs+1).toString(),
            description:request.body.newNotes
        })
        response.json("Added Successfully");
    })
})

app.delete('/api/todoapp/DeleteNotes', (request, response) => {
    database.collection("todoappcollection").deleteOne({
        id:request.query.id
    });
    response.json("Deleted Successfully");
})