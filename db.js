//DATABASE

const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;


//DECSRIBING THE SCHEMA
//USER SCHEMA
const User=new Schema({
    email: {type:String, unique:true},
    password:String,
    name:String
})

//TODO SCHEMA
const Todo=new Schema({
    title:String,
    done:Boolean,
    userId: ObjectId //to which user does the todo belong to
})

//DESCRIBING THE MODELS
const UserModel=mongoose.model('users' ,User); //for pushing the data into the specific collection
const TodoModel=mongoose.model('todos' ,Todo);


//EXPORTTING THE MODELS
module.exports={
    UserModel : UserModel,
    TodoModel :TodoModel
}