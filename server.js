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

app.listen(5000,() => {
    console.log('listening on port 5000');
});