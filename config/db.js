require('dotenv').config()
const mongoose=require('mongoose')
async function connection(){
   await mongoose.connect(process.env.MONGODBURL)
}

module.exports=connection;