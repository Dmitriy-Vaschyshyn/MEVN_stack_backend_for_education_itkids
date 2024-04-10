const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

let app = Express();
app.use(cors());

const { CONNECTION_STRING } = require('./config');



let DATABASENAME = "TaskManagerApp";
let database;

const PORT = 5031;
MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }).then(client => {
    console.log('MONGO DB Connection OK!');
    database = client.db(DATABASENAME);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('MONGO DB Connection Error:', error);
});



app.get('/api/tasknanagerapp/get', (request,response)=>{
    database.collection("TaskManagerAppCollection").find({}).toArray((error,result)=>{
        response.send(result);
    })
});

app.post('/api/tasknanagerapp/add',multer().none(),(request,response)=>{
    database.collection("TaskManagerAppCollection").count({}, function(error,numOfDocs){
        database.collection("TaskManagerAppCollection").insertOne({
            id:(numOfDocs+1).toString(),
            name:request.body.name,
            author:request.body.author,
            data:request.body.createdAt
        });
        response.json("Added Done");
        console.log(request.body.name)
    })
});

app.post('/api/tasknanagerapp/del',(request,response)=>{
    database.collection("TaskManagerAppCollection").deleteOne({
        id:request.query.id
    })
        response.json("Delete Done!");
   
});

app.post('/api/tasknanagerapp/upd', multer().none(), (request, response) => {
    const name = request.body.name;
    const author = request.body.author;

    console.log(name);
    database.collection("TaskManagerAppCollection").findOneAndUpdate(
        { id: request.query.id },
        { $set: { name, author} },
        { returnOriginal: false }, 
        (error, result) => {
            if (error) {
                response.status(500).json("Error updating task");
            } else {
                response.json("Update Done!");
            }
        }
    );
});
