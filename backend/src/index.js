import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";


// connecting wiht DB 
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

// importing app (express) and server (http) from socket.io.js from socketio js file 
import {app , server , io } from "./lib/socket.io.js";

// for eniverment variable 
dotenv.config()

const PORT = process.env.PORT; 
const __dirname = path.resolve()

app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV ==="production"){ 
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get('*', (req, res)=>{ 
        res.sendFile(path.join(__dirname, "../frontend , dist , index.html"))
    })
}

server.listen(PORT, ()=>{ 
    console.log("server is running on port on PORT:" + PORT);
    connectDB()
});