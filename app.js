require("dotenv").config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const PORT = process.env.PORT || 3000;
const herokuVar = process.env.HEROKU_NAME || "local Nicole"
const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGO_URI = "mongodb+srv://nreilly:vY4A1eYR0sVUpISS@cluster0.6kyiorf.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
    
let someVar = "";

async function cxnDB(){

  try{
    client.connect; 
    const collection = client.db("chillyumz").collection("placez");
    const result = await collection.find().toArray();
      
    // console.log("cxnDB result: ", result);
    return result; 

  }
  catch(e){
      console.log(e)
  }
  finally{
    client.close; 
  }


}

app.get('/', async (req, res) => {

  let result = await cxnDB().catch(console.error); 
  res.render('index', {  drinkData : result })

  app.get('/mongo', async (req, res) => {
  
    let result = await cxnDB().catch(console.error); 
  
    console.log('in get to slash mongo', result[1].drink_name); 
  
    res.send(`here ya go, joe. ${ result[1].drink_name }` ); 
  
  })
})

app.post('/addPlace', async (req, res) => {

  try {
    // console.log("req.body: ", req.body) 
    client.connect; 
    const collection = client.db("chillyumz").collection("placez");
    await collection.insertOne(req.body);
      
    res.redirect('/');
  }
  catch(e){
    console.log(error)
  }
  finally{
   // client.close()
  }

})


app.post('/updatePlace/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("chillyumz").collection("placez");
    let result = await collection.findOneAndUpdate( 
      {"_id": ObjectId(req.params.id)}, { $set: {"size": "REALLY YUMMY PLACE" } }
    )
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})

app.post('/deletePlace/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("chillyumz").collection("placez");
    let result = await collection.findOneAndDelete( 
      {
        "_id": ObjectId(req.params.id)
      }
    )
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})

app.listen(PORT, () => {
  console.log(`Server is running & listening on port ${PORT}`);
});

