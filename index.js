
const Express = require("express"); 
const MongoClient = require("mongodb").MongoClient; 
const cors = require("cors"); 
const multer = require("multer"); 
const bcrypt = require('bcrypt'); // для хешування паролів нужно установить

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
app.get('/api/tasknanagerapp/data/:id', (request,response)=>{
    const taskId = request.params.id;  // Отримуємо id задачі з URL
    console.log(taskId);

    // Використання ObjectId для пошуку документу за id у MongoDB
    database.collection("TaskManagerAppCollection").findOne({id: taskId}, (error, result) => {
        if (error) {
            response.status(500).send("Error retrieving data from the database.");
        } else {
            if (result) {
                response.send(result);
            } else {
                response.status(404).send("Task not found.");
            }
        }
    });
});

app.post('/api/tasknanagerapp/add',multer().none(),(request,response)=>{
    database.collection("TaskManagerAppCollection").count({}, function(error,numOfDocs){
        database.collection("TaskManagerAppCollection").insertOne({
            id:(numOfDocs+1).toString(),
            name:request.body.name,
            author:request.body.author,
            data:request.body.createdAt,
            category:request.body.category,
            edited:request.body.edited,
            completed:request.body.completed,
            added:request.body.timeAdded,
            timecomplited:request.body.timeComplited
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
    const category = request.body.category;
    const edited = request.body.edited;
    const completed=request.body.completed;
    const timecomplited=request.body.timeComplited

    console.log(name);
    database.collection("TaskManagerAppCollection").findOneAndUpdate(
        { id: request.query.id },
        { $set: { name, author, category, edited, completed, timecomplited} },
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
app.post('/api/tasknanagerapp/login', multer().none(),(request,response)=>{ 
    const username = request.body.username; 
    const password = request.body.password; 
    const email = request.body.email;
 
    if(!username || !password || !email) { 
        return response.status(400).send('UserName and Password and Email are required!'); 
    } 
 
 
    database.collection("Users").findOne({email:email}, (error, user)=>{ 
        if(error){ 
            return response.status(500).send(' Error Login!');  
        } 
 
        if(!email) { 
            return response.status(404).send('Email Is Not Found!');  
        } 
 
 
        
        if(bcrypt.hash(password,10)==user.password){
            response.json({message:"Login Successful!", userId: user.id, userName: user.username}); 

        }
 
 
        if(bcrypt.hash(password,10)!=user.password) { 
            return response.status(401).send("Invalid Password!") 
        } 
 
 
        
    }) 
})
app.post('/api/tasknanagerapp/register', multer().none(),(request,response)=>{ 
    const username = request.body.username; 
    const password = request.body.password; 
    const email = request.body.email;
 
    if(!username || !password) { 
        return response.status(400).send('UserName and Password are required!'); 
    } 
 
    
 
    
    database.collection("Users").findOne({email:email}, (error, user)=>{ 
        if(error){ 
            return response.status(500).send(' Error Register!');  
        } 
 
        if(email) { 
            return response.status(404).send('This Email is already in use');  
        }
        const hashedPassword = bcrypt.hash(password, 10); 
        database.collection("Users").insertOne({ 
            username: username, 
            password: hashedPassword,
            email: email
        }, (error, result) => { 
            if(error){ 
                return response.status(500).send('Error for register new User!');  
            } 
            response.status(201).send('User register succesfully!'); 
             
        }) 
 
 
        
 
 
        
 
 
        response.json({message:"Login Successful!", userId: user.id, userName: user.username}); 
    }) 
    
})