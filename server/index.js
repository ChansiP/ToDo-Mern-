//require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
//const connection = require("./db");
const mongoose = require('mongoose')
const User = require('./models/usermodel')
const jwt_decode = require('jwt-decode');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const TodoItemSchema = require('./routes/todoItems');
const todoItemSchema = require('./models/todoitems');


app.use(cors())
app.use(express.json())
//app.use('/', TodoItemSchema);

//mongoose.connect(`mongodb://127.0.0.1:27017/mydatabase`)
//const db = mongoose.connection;
//db.on('error', (error) => {
  //console.error('MongoDB connection error:', error);
//});
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

app.post('/api/register',async (req,res)=>{
    console.log(req.body)
    try{
         
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({status:'ok'})
    
    
    }
    catch(err){
        console.log(err)
    res.json({status:'error', error:'Duplicate email'})
    }
})

app.post('/api/login',async (req,res)=>{
    
    const token = req.headers['x-access-token']
    console.log('Token:', token);
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const decoded = jwt.verify(token,'secret123');
        req.user = decoded;
        res.json(req.user);
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
    
        //console.log('Token:', token);
        //if (!token) return res.status(401).send('Access Denied');
        //try {
            //const decoded = jwt.verify(token,'secret123');
            //req.user = decoded;
            //res.json(req.user);
        //} catch (err) {
            //res.status(400).send('Invalid Token');
        //}
   
         try{
        const user = await User.findOne({
            
            email: req.body.email,
            password: req.body.password,
        })

        if (user && bcrypt.compareSync(req.body.password,user.password)) {
            const token = jwt.sign({
                name: user.name,
                email: user.email,
                
            },
            'secret123'
            )
            

            return res.json({status:'ok', user:token})
        }
        else{
            return res.json({status:'error', user:false })
        }
    }catch{
        console.log(err)
        res.json({status:'error', error:err.message})
    }
        
    
    
   
})
app.post('/api/item', async (req, res) => {
    try {
      const newItem = new todoItemSchema({
        item: req.body.item
      });
  
      // save the new item to the database
      const savedItem = await newItem.save();
  
      // fetch all items from the database
      const allItems = await todoItemSchema.find({});
  
      // send the updated list of items as the response
      res.status(200).json(allItems);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  //create second route -- get data from database
  app.get('/api/item', async (req, res)=>{
    try{
      const allTodoItems = await todoItemSchema.find({});
      res.status(200).json(allTodoItems)
    }catch(err){
      res.json(err);
    }
  })
  app.delete('/api/item/:id', async (req, res) => {
    try {
      const deleteItem = await todoItemSchema.findByIdAndDelete(req.params.id);
      res.status(200).json(deleteItem);
    } catch (err) {
      res.json(err);
    }
  });
  app.put('/api/item/:id', async (req, res) => {
    try {
      const updatedItem = await todoItemSchema.findOneAndUpdate(
        { _id: req.params.id },
        { item: req.body.item },
        { new: true }
      );
      res.json(updatedItem);
    } catch (err) {
      console.error(err);
      res.json({ status: 'error', error: err.message });
    }
  });
  
  

//database connection
//connection();
//app.use('/', TodoItemRoute);
const port = process.env.PORT || 8080;
app.listen(1337,() => console.log(`Listening on port ${port}...`)); 
