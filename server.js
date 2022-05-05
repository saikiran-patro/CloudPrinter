import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
  }));

mongoose.connect("mongodb://localhost:27017/cpAdidb", {useNewUrlParser: true},{ useUnifiedTopology: true } );
app.set('view engine', 'ejs');



const adminSchema=new mongoose.Schema({
  AdminID:String,
  Password:String,
  

})
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
app.listen(5000,() => {
    console.log('listening on port 5000');
});