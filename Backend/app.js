const express=require('express')
const cors=require('cors')
//const axios = require('axios');
const path=require('path')
const router=require('./router/router');
const { error } = require('pdf-lib');
const app = express();
app.use(cors())
app.use(express.json())
require('dotenv').config();


app.use('/uploads', express.static(path.join(__dirname, 'router/uploads')));
app.use('/',router);




app.listen(4700,()=>{
    console.log(`server is running on Port 4700`);
})