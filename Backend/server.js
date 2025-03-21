//imported express framework
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();





const app = express(); //initiating app using express module



    app.get("/",(req,res) =>{ 

        res.send("Server is working");
        
    });


app.listen(5999, () => {
    
    console.log("Server started at http://localhost:5999")
    connectDB();

});
