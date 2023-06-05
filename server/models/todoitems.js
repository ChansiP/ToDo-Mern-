const mongoose = require('mongoose');

const TodoItemSchema = new mongoose.Schema({
    item:{
        type:String,
        required: true,

    }

},{collection : 'todo_data'})


module.exports = mongoose.model('todo',TodoItemSchema);