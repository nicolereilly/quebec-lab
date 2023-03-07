require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const PORT = process.env.PORT || 3000;
const herokuVar = process.env.HEROKU_NAME || "local Barry"
const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGO_URI = "mongodb+srv://nreilly:vY4A1eYR0sVUpISS@cluster0.6kyiorf.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


async function cxnDB(){

  try{
    client.connect; 
    const collection = client.db("papa-lab").collection("dev-profiles");
    const result = await collection.find().toArray();
    console.log("cxnDB result: ", result);
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

  res.render('index', {
  universityData : result
  });
})

app.get('/mongo', async (req, res) => {


  let result = await cxnDB().catch(console.error); 

  console.log('in get to slash mongo', result[2].name); 

  res.send(`here ya go, joe. ${ result[2].name }` ); 

})

app.get('/update', async (req, res) => {

    console.log("in get to slash update:", req.query.ejsFormName); 
    myName = req.query.ejsFormName; 

    client.connect; 
    const collection = client.db("papa-lab").collection("dev-profiles");

    await collection.insertOne({
      name: "Joe"
    });
})


app.post('/addName', async (req, res) => {

  try {

    client.connect; 
    const collection = client.db("papa-lab").collection("dev-profiles");
    await collection.insertOne(req.body);
      
    res.redirect('/');
  }
  catch(e){
    console.log(error)
  }
  finally{
  }

})

app.post('/deleteName/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("papa-lab").collection("dev-profiles");
    let result = await collection.findOneAndDelete( 
      {
        "_id": new ObjectId(req.params.id)
      }

    )
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
  }

})

app.post('/updateUniversity/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("papa-lab").collection("dev-profiles");
    let universityData = await collection.findOneAndUpdate( 
      { "_id": ObjectId(req.params.id) }, {$set: {name: "New University" }} )
      //{ "_id": new ObjectId(req.params.id) }, {$set: {name: "New University" }} )

    .then(universityData => {
      console.log(universityData); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})



console.log('in the node console');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${ PORT }`)
})