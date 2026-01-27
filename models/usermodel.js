const mongoose=require('mongoose')

const userschema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,min:1,max:8},
    role:{type:String, enum:['seller','customer','admin'] ,default: 'customer'}
},{timestamps:true})

const usermodel=mongoose.model('users',userschema)

module.exports=usermodel;