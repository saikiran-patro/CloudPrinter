import express from 'express';
import bodyParser from 'body-parser'
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.set('view engine', 'ejs');

app.get('/',(req, res) => {
   res.render('sign')
})
app.post('/signin',(req, res) => {
  res.render('Admin');
})

app.get("/printerdetails",(req, res) => {
  res.render('printers');
})
app.listen(5000,() => {
    console.log('listening on port 5000');
});