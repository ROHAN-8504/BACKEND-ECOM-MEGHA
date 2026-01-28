//create a server
const express=require('express');
const bcrypt=require('bcrypt')
const cors=require('cors')
require('dotenv').config()
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken')
const app=express();
const port=process.env.PORT
let connection=require('./config/db')
let limiter=require('./middlewares/ratelimit')
app.use(cors())  //middleware
app.use(express.json())
app.use(limiter)
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

 //logic to send a mail

 let transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
   user:process.env.GMAIL_USER,
   pass:process.env.GMAIL_APP_PASSWORD
  }
 })

const mailOptions = {
  from: process.env.GMAIL_USER,
    to: email, 
  subject: 'ACCOUNT CREATION',
  text: 'Hello! This is a your account details.',
  html: `
    <h2>hi ${username} your account is created succesfully/h2>
  `
};

transporter.sendMail(mailOptions,(err)=>{
  if(err) throw err;
  console.log('email sent')
})

  res.json({msg:'REGISTRATION SUCCESSFULL'})
  } catch (error) {
        res.json({"msg":error.message})
  }
})


app.post('/login',async (req,res)=>{
try { 
const {email,password}=req.body;
if(!email || !password){
  return res.json({msg:'missing fields'})
}

let users = await usermodel.findOne({email})

if(!users) return res.json({'msg':'invalid credentials'}) 

let checkpassword=await bcrypt.compare(password,users.password)
if(!checkpassword) return res.json({msg:'invalid credentials'})
//create a token
let payload={
  email:users.email,
  userid:users._id
}
let secretkey=process.env.SECRETKEY
let token=jwt.sign(payload,secretkey,{expiresIn:'7d'})

res.json({msg:'LOGIN SUCCESFULL',token})
} catch (error) {
  res.json({msg: error.message})
}
})



app.listen(port,async ()=>{
    console.log(`the server is running on ${port}`)
    connection();
    console.log('DB connectED')

})