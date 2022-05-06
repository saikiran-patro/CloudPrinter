import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';

import multer from 'multer';
const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, './public/uploads/images');
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});


const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
  }));


mongoose.connect("mongodb://localhost:27017/cpAdidb", {useNewUrlParser: true},{ useUnifiedTopology: true } );
//const conn=mongoose.createConnection("mongodb://localhost:27017/cpAdidb");


app.set('view engine', 'ejs');



const adminSchema=new mongoose.Schema({
  AdminID:String,
  Password:String,
  

})
// const printerSchema= new mongoose.Schema({

// })
const Admin= mongoose.model("Admin",adminSchema);
app.get('/',(req, res) => {
   res.render('sign',{flag:0})
})
app.post('/signin',(req, res) => {

  const id = req.body.id;
  const password = req.body.password
  Admin.findOne({AdminID: id, Password: password},(err, foundUser)=>{

      if(err){
          console.log(err);

      }
      else{
          if(foundUser){
            res.render('Admin');
          }
          else{
              
            res.render('sign',{flag:1})
          }
      }

  })
 
})

app.get("/printerdetails",(req, res) => {
  res.render('printers');
})

app.post("/addprinter",(req, res) => {

  console.log( req.body.image);
  console.log( req.body.nameofprinter );
  console.log( req.body.printertype);
  console.log( req.body.duplex );
  console.log( req.body.color );
  console.log( req.body.BlackandWhite );
  console.log( req.body.location );
  console.log( req.body.status);
  res.send("helloworld");

})
app.listen(5000,() => {
    console.log('listening on port 5000');
});