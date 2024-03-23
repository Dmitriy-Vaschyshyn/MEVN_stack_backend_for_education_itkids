const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

let app = Express();
app.use(cors());

let CONNECTION_STRING = "mongodb+srv://admin:Niagara33@cluster0.wdskhgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";






let DATABASENAME = "TaskManagerApp";
let database;

const PORT = 5031;
app.listen(PORT, ()=>{
    MongoClient.connect(CONNECTION_STRING, (error,client)=>{
        database=client.db(DATABASENAME);
        console.log('MONGO DB Connection OK!');
        console.log(`Server is running on port ${PORT}`);
    });
})


app.get('/api/tasknanagerapp/get', (request,response)=>{
    database.collection("TaskManagerAppCollection").find({}).toArray((error,result)=>{
        response.send(result);
    })
});


app.post('/api/tasknanagerapp/add',multer().none(),(request,response)=>{
    database.collection("TaskManagerAppCollection").count({}, function(error,numOfDocs){
        database.collection("TaskManagerAppCollection").insertOne({
            id:(numOfDocs+1).toString(),
            title:request.body.newData
        });
        response.json("Added Done");
    })
});

app.post('/api/tasknanagerapp/del',(request,response)=>{
    database.collection("TaskManagerAppCollection").deleteOne({
        id:request.query.id
    })
        response.json("Delete Done!");
   
});

app.post('/api/tasknanagerapp/upd', multer().none(), (request, response) => {
    const title = request.body.newData;
    
    database.collection("TaskManagerAppCollection").findOneAndUpdate(
        { id: request.query.id },
        { $set: { title } },
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