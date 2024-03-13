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

app.post('/api/tasknanagerapp/upd',multer().none(),(request,response)=>{
    const { title, description, completed } = request.body;
    database.collection("tasknanagerappcollection").findByIdAndUpdate(request.params.id, {
        title
    }, {new: true})
        response.json("UPdate Done!");
});