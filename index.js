import express from 'express'
import cors from 'cors';
const app = express();
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 5000;
import mongoose from 'mongoose';
import router from './src/app/router/router.js';
app.use(express.json());

app.use(
    cors({
      origin: [
        
        "http://localhost:3000"
      ],
      credentials: true,
    })
);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.udxqu.mongodb.net/shoply?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
.then(()=> console.log('connection successful'))
.catch(err => console.log(err))



app.use("/api/v1", router);

app.get('/', (req,res)=>{
    res.json({message : "Welcome to shoply server."})
})


app.listen(PORT , ()=>{
    console.log("Server is running on port ",PORT)
})