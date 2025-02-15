const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {notfound,errorHandler} = require('./middleware/errorMiddleware');
const path = require('path');
 


dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('API is running...');
})

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);

const PORT = process.env.PORT || 5001;

app.use(notfound);
app.use(errorHandler);


app.listen(PORT,console.log(`Server running on port ${PORT}`.blue.bold));