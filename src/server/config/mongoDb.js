const mongoose = require('mongoose');
const express = require('express');
const db = require("./keys").mongoURI;
const createServer = require("./createServer");


const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../../../../models/User');  // .js uzantısını eklemeye gerek yok
const Message = require('../../../../models/Message');  // .js uzantısını eklemeye gerek yok
const { readDataFromFile } = require("../../../../data-manager");
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://elifkeskin233:elifkeskin@contactform.vcsb2.mongodb.net/?retryWrites=true&w=majority&appName=ContactForm";

mongoose
  .connect(db)
  .then(()=>{
    const app = createServer();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  })
  .catch((err)=>{
    console.log(`could not connect to mongoDb and start the server`);
    console.log(err);
  });







/*
const app = express();
app.use(cors());
app.use(express.json());
const port = 5166;

const conn = () => {
  mongoose.connect(process.env.DB_URI,{
    dbName : "contactform",
    useNewUrlParser : true,
    userUnifiedTopology: true,
  
  }).then(()=>{
    console.log("connected to db succesfully");
})
  .catch((err)=>{
    console.log(`DB connection error:, ${err}`);
  });
};

conn();

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    await client.close();
  }
}
run().catch(console.dir);

*/
const JWT_SECRET_KEY = 'contact-form-manager-server-secret-key';

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// sample GET request handler (you can ignore this endpoint)
app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'Anonymous';
  res.status(200).send(`Hello, ${name}!`);
});

// sample POST request handler (you can ignore this endpoint)
app.post('/api/message', express.json(), (req, res) => {
  const message = req.body.message || 'No message provided';
  res.status(200).send(`Your message: ${message}`);
});

async function checkTokenAndRole(req, res, roleList){
  const {token} = req.headers;
  if(!token){
    res.status(401).send({error: 'User is not authenticated'});
    return false;
  }
  try{
    const jwtTokenPayload = jwt.verify(token, JWT_SECRET_KEY);
    const blacklistedTokens = await readDataFromFile("data/blacklisted-tokens.json");
    if(blacklistedTokens.includes(token)){
      res.status(401).send({error: 'User is not authenticated'});
      return false;
    }
    const currentUsers = await readDataFromFile("data/users.json");
    const existingUser = currentUsers.find(user => user.id === jwtTokenPayload.userId);
    if(!existingUser){
      res.status(401).send({error: 'User is not authenticated'});
      return false;
    }
    if(roleList && roleList.length > 0 && !roleList.includes(existingUser.role)){
      res.status(403).send({error: 'User is not authorized'});
      return false;
    }
  }
  catch(err){
    res.status(401).send({error: 'User is not authenticated'});
    return false;
  }
  return true;
}

// POST login user
app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required' });
  }

  const existingUser = await User.findOne({ username });
  if (!existingUser || existingUser.password !== password) {
    return res.status(400).send({ error: 'Invalid username or password' });
  }

  const jwtTokenPayload = {
    userId: existingUser._id,
    username: existingUser.username,
  };
  const jwtToken = jwt.sign(jwtTokenPayload, JWT_SECRET_KEY, { expiresIn: '10m' });
  res.status(200).send({ data: { user: existingUser, token: jwtToken } });
});

// POST check if user is logged in
app.post('/api/user/check-login', async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).send({ error: 'Token is required' });
  }

  try {
    const jwtTokenPayload = jwt.verify(token, JWT_SECRET_KEY);
    const existingUser = await User.findById(jwtTokenPayload.userId);
    if (!existingUser) {
      return res.status(400).send({ error: 'User does not exist' });
    }
    res.status(200).send({ data: { user: existingUser } });
  } catch (err) {
    res.status(401).send({ error: 'Token is invalid' });
  }
});


app.post('/api/user/logout', async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).send({ error: 'Token is required' });
  }

  // Add token to blacklist logic here, if needed
  res.status(200).send({ data: { message: 'Logged out successfully' } });
});


// GET countries
app.get('/api/countries', async (req, res) => {
  const countries = await readDataFromFile("data/countries.json");
  res.status(200).send({data: {countries}});
});


// POST add new message
app.post('/api/message/add', async (req, res) => {
  const { name, message, gender, country } = req.body;
  if (!name || !message || !gender || !country) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const newMessage = new Message({
    name,
    message,
    gender,
    country,
    creationDate: new Date(),
    read: false,
  });

  await newMessage.save();
  res.status(200).send({ data: { message: newMessage } });
});



// GET messages
app.get('/api/messages', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }
  const messages = await Message.find();
  res.status(200).send({ data: { messages } });
});


// GET message by id
app.get('/api/message/:id', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }

  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).send({ error: 'Message not found' });
  }
  res.status(200).send({ data: { message } });
});


// POST read message by id
app.post('/api/message/read/:id', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }

  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).send({ error: 'Message not found' });
  }

  message.read = true;
  await message.save();
  res.status(200).send({ data: { message } });
});



// POST delete message by id
app.post('/api/message/delete/:id', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }

  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(404).send({ error: 'Message not found' });
  }
  res.status(200).send({ data: { message: { id: message._id } } });
});



// POST add new user with reader role
app.post('/api/user/add-reader', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }

  const { username, password, base64Photo } = req.body;
  if (!username || !password || !base64Photo) {
    return res.status(400).send({ error: 'Username, password, and photo are required' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send({ error: 'Username already exists' });
  }

  const newUser = new User({
    username,
    password,
    base64Photo,
    role: "reader"
  });

  await newUser.save();
  res.status(200).send({ data: { user: newUser } });
});


// GET users
app.get('/api/users', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }
  const users = await User.find();
  res.status(200).send({ data: { users } });
});


// GET user by id
app.get('/api/user/:id', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.status(200).send({ data: { user } });
});

// POST update user by id
app.post('/api/user/update/:id', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }

  const { username, password, base64Photo } = req.body;
  if (!username || !password || !base64Photo) {
    return res.status(400).send({ error: 'Username, password, and photo are required' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  user.username = username;
  user.password = password;
  user.base64Photo = base64Photo;
  await user.save();
  res.status(200).send({ data: { user } });
});



// Post Filter messages
//new endpoint
app.post('/api/messages/filter', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }

  const { sortBy, filterOptions, messageLimit } = req.body;

  let filteredMessages = Message.find();

  if (filterOptions.gender.length > 0) {
    filteredMessages = filteredMessages.where('gender').in(filterOptions.gender);
  }

  if (filterOptions.status.length > 0) {
    filteredMessages = filteredMessages.where('read').in(filterOptions.status.includes('read') ? [true] : [false]);
  }

  switch (sortBy) {
    case 'date_asc':
      filteredMessages = filteredMessages.sort({ creationDate: 1 });
      break;
    case 'date_desc':
      filteredMessages = filteredMessages.sort({ creationDate: -1 });
      break;
    case 'sender_name_asc':
      filteredMessages = filteredMessages.sort({ name: 1 });
      break;
    case 'sender_name_desc':
      filteredMessages = filteredMessages.sort({ name: -1 });
      break;
    default:
      break;
  }

  filteredMessages = filteredMessages.limit(messageLimit);

  const messages = await filteredMessages.exec();

  res.status(200).send({ data: { messages } });
});

