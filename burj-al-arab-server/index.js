const express = require('express')
const bodyParser=require('body-parser');
const cors=require('cors')
const admin = require('firebase-admin');


var serviceAccount = require("./config/burj-al-arab-check-firebase-adminsdk-tx5xi-d362401246.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

require('dotenv').config()
console.log(process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gyuhd.mongodb.net/burjAlArab?retryWrites=true&w=majority`;


const pass="ArabianHorse79"
const app = express()


app.use(cors())
app.use(bodyParser.json())



const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("burjAlArab").collection("bookings");
  //console.log("db connected successfully")

  app.post('/addBooking',(req,res)=>{
      const newBooking=req.body;
      bookingCollection.insertOne(newBooking)
     .then(result=>{
        res.send(result.insertedCount>0);
     })
      console.log(newBooking)
  })
  app.get('/booking',(req,res)=>{
    //   console.log(req.headers.authorization)
      const bearer=req.headers.authorization;
      if(bearer && bearer.startsWith('Bearer ')){
        const idToken=bearer.split(' ')[1];
       
        admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail=req.query.email;
          
         
          if(tokenEmail==queryEmail){
            bookingCollection.find({email:queryEmail})
            .toArray((err,documents)=>{
                res.status(200).send(documents)
            })
          }
          else{
            res.status(401).send('Unauthorized access ')
        }
          // ...
        })
        .catch((error) => {
            res.status(401).send('Unauthorized access ')
        });
      

      }

      else{
          res.status(401).send('Unauthorized access ')
      }
    

   
})

});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(5000)
