const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World! Book plex')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfjfv.mongodb.net/book-plex-data?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("book-plex-data").collection("pruducts");
  const ordersCollection = client.db("book-plex-data").collection("orders");
  console.log('Database connected');

  app.get('/pruducts', (req, res) => {
    bookCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})
 


app.get('/pruducts/:id', async(req,res)=>{
 
 try {
  const product = await bookCollection.findOne({_id: ObjectId(req.params.id)});
  res.send(product);
   
 } catch (err) {
   console.log(err);
 }
 


});

//   event add code 

  app.post('/addProduct', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    bookCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.delete('/deleteBook/:id', (req, res) => {
    const id = req.params.id;
    bookCollection.findOneAndDelete({_id: ObjectId(id)})
    .then(result => res.send(result))
    .catch(err => console.log(err))
})

app.post('/addOrders', (req, res) => {
  const orders = req.body;
  console.log('adding new order info: ', orders)
  ordersCollection.insertOne(orders)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})

//    client.close();
});


app.listen(process.env.PORT || port, ()=> {
  console.log('server is running' + port);
} )