
const db=require('mysql')
require('dotenv').config();


const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;


const con=db.createConnection({
    host:dbHost,
    user:dbUser,
    password:dbPassword,
    database:dbName
})
con.connect((err,res)=>{
    if(err)
    console.log(err);
console.log("connected");
})

module.exports=con