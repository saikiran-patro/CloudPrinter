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
    callback(null, file.originalname);
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
//app.use(express.static( __dirname + '/public'));

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


            printer.find({},(err,printers)=>{
              if(err){
                console.log(err);
                res.send('error');
    
              }
              else{
                if(printers){
                  res.render('Admin',{printerList:printers});
                }
              }
            })
          }
          else{
              
            res.render('sign',{flag:1})
          }
      }

  })
 
})

app.get("/printerdetails",(req, res) => {
  res.render('printers',{flags:false});
})

app.post("/addprinter",upload.single('image'), (req, res) => {

  const Image=req.file.filename;  //here working with single route 
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
  
  const newPrinter = new printer({
    Img:Image,
    Nameofprinter:PrinterName,
    Typeofprinter:PrinterType,
    Methods:methods,
    Location:Location,
    Status:Status,

  })
  let flag=false;
  newPrinter.save((err)=>{
    if(err){
        console.log(err);
        flag=true;
        res.render('printers',{flags:flag});
    }
    else{
        printer.find({},(err,printers)=>{
          if(err){
            console.log(err);
            res.send('error');

          }
          else{
            if(printers){
              res.render('Admin',{printerList:printers});
            }
          }
        })
      
      
    }
})
  

})

/// delete a printer from the database
app.get('/adminprinters',(req,res)=>{
   
  printer.find({},(err,printers)=>{
    if(err){
      console.log(err);
      res.send('error');

    }
    else{
      if(printers){
        
        res.render('Admin',{printerList:printers});
      }
    }
  })
})

app.post('/printer/delete/:name', (req, res)=>{

  printer.deleteOne({Nameofprinter:req.params.name},(err)=>{
    if(!err){
      res.redirect('/adminprinters');
    }else{
      res.send("error")
    }
    
  })

})

//configure the printer 

app.post('/:name', (req, res)=>{

  let paramaVal=req.params.name;
  if(paramaVal.includes('edit')){
   // const Image=req.file.filename;  //here working with single route 
  const Printername=req.body.nameofprinter;
  const Printertype=req.body.printertype;
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

  const address=req.body.location;
  let Status=true;
  if(req.body.status=="Active"){
     Status=true;
  }
  else{
    Status=false;
  }
 // console.log( req.file.filename);
     paramaVal=paramaVal.replace('edit','');
    printer.updateOne({Nameofprinter:paramaVal},{$set: {Img:req.body.image,Nameofprinter:Printername,Typeofprinter:Printertype,Methods:methods,Location:address,Status:Status}},(err)=>{
      if(!err){
        res.redirect('/adminprinters');
      }else{
        res.send("error")
      }
    });

  }
  else{
    printer.findOne({Nameofprinter:req.params.name},(err,founduser)=>{
      if(founduser){
        console.log(founduser)
        res.render('printeredit',{printerDetails:founduser})
      }
      else{
        res.send("error")
      }
    })

  }

  
})

// USER COMPUTATION

app.get('/user',(req, res)=>{

  res.render('user')
})
  
app.listen(5000,() => {
    console.log('listening on port 5000');
});