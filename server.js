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
const printerSchema= new mongoose.Schema({
   Img:String,
   Nameofprinter:{
     type:String,
     unique:true,
   },
   Typeofprinter:String,
   Methods:[],
   Location:String,
   Status:Boolean,
})
const printer=mongoose.model('printer',printerSchema);
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

app.post("/addprinter",upload.single('image'), (req, res) => {

  const Image=req.body.image;
  const PrinterName=req.body.nameofprinter;
  const PrinterType=req.body.printertype;
  let methods=[];
  if(req.body.duplex=="Duplex"){
    methods.push("Duplex");
  }
  if(req.body.colour=="Colour"){
     methods.push("Colour");
  }
  if(req.body.BlackWhite=="BlackWhite"){
    methods.push("BlackWhite");
  }

  const Location=req.body.location;
  let Status=true;
  if(req.body.status=="Active"){
     Status=true;
  }
  else{
    Status=false;
  }
  console.log( req.file.filename);
  console.log( req.body.nameofprinter );
  console.log( req.body.printertype);
  console.log( req.body.duplex );
  console.log( req.body.colour );
  console.log( req.body.BlackWhite );
  console.log( req.body.location );
  console.log( req.body.status);

  const newPrinter = new printer({
    Img:Image,
    Nameofprinter:PrinterName,
    Typeofprinter:PrinterType,
    Methods:methods,
    Location:Location,
    Status:Status,

  })
  newPrinter.save((err)=>{
    if(err){
        console.log(arr);
    }
    else{

        // res.render("contacts",{contactLists:[]})
        res.send("helloworld");
    }
})
  

})
app.listen(5000,() => {
    console.log('listening on port 5000');
});