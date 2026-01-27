//create a server
const express=require('express');
const mongoose=require('mongoose')
const cors=require('cors')
const app=express();
const port=3000
app.use(cors())  //middleware
app.use(express.json())

//s2-estabish a conecction
async function connection(){
   await mongoose.connect('mongodb://localhost:27017/meghabackend')
}

//s3-create a schema
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

//s4-create a model
let productmodel=mongoose.model('products',productschema)

//HEALTH CHECK
app.get('/status',(req,res)=>{
    res.send('server is active')
})

//API2-IF I RECIEVE ANY DATA FROM THE CLIENT I WILL
//STORE IN DB

app.post('/products',async (req,res)=>{
    try {
        const {title,image,price}=req.body
      await  productmodel.create({title,image,price})
      res.status(201).json({"msg":'products are added'})
    } catch (error) {
        res.json({
            msg:error.message
        })
    }
})

app.get('/products',async (req,res)=>{
try {
  let products= await productmodel.find()
  res.status(200).json(products)
} catch (error) {
    res.json({"msg":error.message})
}
})


app.delete('/products/:id',async (req,res)=>{
 try {
   let productid=req.params.id
  await productmodel.findByIdAndDelete(productid)
  res.json({msg:'product is deleted'})
 } catch (error) {
    res.json({msg:error.message})
 }
})

app.put('/products/:id',async (req,res)=>{
  try {
    let productid=req.params.id
    await  productmodel.findByIdAndUpdate(productid,req.body)
    res.json({"msg":"product is updated"})
  } catch (error) {
    res.json({"msg":error.message})
  }

})


app.listen(port,async ()=>{
    console.log(`the server is running on ${port}`)
    connection();
    console.log('DB connectED')

})