const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_SECRET = "randomsecret";
const bcrypt = require('bcrypt');
const { z } = require("zod");
const cors = require('cors');

mongoose.connect("mongodb+srv://amberhasan237_db_user:310504@cluster0.qngyuir.mongodb.net/todo-amber_hasan");

app.use(express.json());
app.use(cors()); // Enable CORS for all origins
const { UserModel, TodoModel } = require("./db");

app.post('/signup', async function (req, res) {

    //specifying the schem of my req body
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        name: z.string().min(3).max(100)

    })
    const paresedDatawithSuccess = requireBody.safeParse(req.body);

    if (!paresedDatawithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: paresedDatawithSuccess.error
        })
        return
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;





    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        //hashing the password using bcrypt algo(salting) if it is a new user
        const hashedPassword = await bcrypt.hash(password, 5); //here 5 means i am hashing my password 5 times so that the hacker can not your brute force(generating all the possible passwords) inorder to decode my password
        console.log("Your hashed password is :", hashedPassword);

        //making the entry of the new user in our db
        await UserModel.create({
            name: name,
            password: hashedPassword,
            email: email
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
});


app.post('/signin', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
    });
    if (!response) {
        res.status(403).json({
            message: "User does not exist in our DataBase"
        })
        return
    }

    const passwordMatch = await bcrypt.compare(password, response.password); //{password that the user sent me , entry from the database}

    if (passwordMatch) {
        const token = jwt.sign(
            { userId: response._id.toString() }, // creating a token using user id
            JWT_SECRET
        );
        res.json({ token });
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        });
    }
});

//put the user's todo
app.post('/todo', auth, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;
    await TodoModel.create({
        title,
        userId,
        done
    });

    res.json({
        message: "Todo created"
    });
});
//get your todos
app.get('/todos', auth, async function (req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId: userId
    })
    res.json({
        todos
    })
});

// Update todo done status
app.patch('/todo/:id', auth, async (req, res) => {
    const todoId = req.params.id;
    const userId = req.userId;
    const { done } = req.body;

    try {
        // Find todo by id and userId to ensure user owns it
        const todo = await TodoModel.findOne({ _id: todoId, userId: userId });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        todo.done = done; // update done status
        await todo.save();

        res.json({ message: "Todo updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating todo", error: err.message });
    }
});

// Delete todo
app.delete('/todo/:id', auth, async (req, res) => {
    const todoId = req.params.id;
    const userId = req.userId;

    try {
        // Delete todo document only if it belongs to authenticated user
        const deleted = await TodoModel.findOneAndDelete({ _id: todoId, userId: userId });
        if (!deleted) {
            return res.status(404).json({ message: "Todo not found or not authorized" });
        }

        res.json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting todo", error: err.message });
    }
});


//middlware
function auth(req, res, next) {
    const token = req.headers.token;  //getting the token
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);   //verifying the token
        req.userId = decodedData.userId;
        next();
    } catch (err) {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
}



app.listen(3000);


