const mongoose=require('mongoose')
let productschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

let productmodel=mongoose.model('products',productschema)

module.exports=productmodel;