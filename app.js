//create a server
const express=require('express');
const bcrypt=require('bcrypt')
const cors=require('cors')
const app=express();
const port=3000
let connection=require('./config/db')
app.use(cors())  //middleware
app.use(express.json())
let productmodel=require('./models/productmodel')
let usermodel=require('./models/usermodel')
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

//register
app.post('/register',async (req,res)=>{
  try {
    const {username,password,email,role}=req.body

  if(!username || !password || !email )
  {
    return  res.json({'msg':'missing fields'})
  }

  let saferole=role==='seller'?'seller':'customer'
  let userexist=await usermodel.findOne({email})
  if(userexist) return res.json({'msg':'user already exists'})
  let hashpassword= await bcrypt.hash(password,10)
  await usermodel.create({username,password:hashpassword,email,role:saferole})
  res.json({msg:'REGISTRATION SUCCESSFULL'})
  } catch (error) {
        res.json({"msg":error.message})
  }
})



app.listen(port,async ()=>{
    console.log(`the server is running on ${port}`)
    connection();
    console.log('DB connectED')

})