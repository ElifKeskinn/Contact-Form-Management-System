const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb'); 
const bodyParser = require('body-parser');

const uri = "mongodb://localhost:27017/ContactForm";
const port = 5166;
const app = express();
const JWT_SECRET_KEY = 'contact-form-manager-server-secret-key';

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));

app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  console.log('Request Headers:', req.headers);
  next();
});



let db;
let client;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 30000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }


  try {
    if (!db) {
      await client.connect();
      db = client.db('ContactForm');
      console.log("MongoDB'ye başarıyla bağlanıldı.");
    }
  } catch (error) {
    console.error('MongoDB bağlantısı başarısız:', error);
    process.exit(1);
  }
};

const ensureDbConnection = async () => {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
};


const startServer = async () => {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  
  });
};

startServer();

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});


// sample GET request handler (you can ignore this endpoint)
app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'Anonymous';
  res.status(200).send(`Hello, ${name}!`);
  
});

/*
// sample POST request handler (you can ignore this endpoint)
app.post('/api/message', express.json(), (req, res) => {
  const message = req.body.message || 'No message provided';
  res.status(200).send(`Your message: ${message}`);
});*/

/*

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
*/


// test endpoint

app.get('/api/user/test', async (req, res) => {
  try {
    const db = client.db('ContactForm'); 
    const usersCollection = db.collection('users'); 
    const users = await usersCollection.find().toArray(); 
    console.log('Users fetched:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});





// POST login user
app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });
  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required' });
  }

  try {
    const db = client.db('ContactForm');
    const usersCollection = db.collection('users');

    // Find the user by username
    const existingUser = await usersCollection.findOne({ username });
    console.log('Existing user:', existingUser);

    if (!existingUser || existingUser.password !== password) {
      return res.status(400).send({ error: 'Invalid username or password' });
    }

  const jwtTokenPayload = {
    userId: existingUser._id,
    username: existingUser.username,
  };
  const jwtToken = jwt.sign(jwtTokenPayload, JWT_SECRET_KEY, { expiresIn: '10m' });
  res.status(200).send({ data: { user: existingUser, token: jwtToken } });
} catch (error) {
  console.error('Error during login:', error);
  res.status(500).send({ error: 'Internal server error' });
}
});


// POST check if user is logged in
app.post('/api/user/check-login', async (req, res) => {
  // Extract token from Authorization header
  const token = req.headers.token;
  if (!token) {
    return res.status(401).send({ error: 'Token is required' });
  }

  try {
    await ensureDbConnection();
    const db = client.db('ContactForm');
    const usersCollection = db.collection('users');

    const jwtTokenPayload = jwt.verify(token, JWT_SECRET_KEY);
    console.log('JWT Payload:', jwtTokenPayload);

    const id3 = jwtTokenPayload.userId;

  
    const userId = ObjectId.createFromHexString(id3);
    console.log('Searching for user with ID:', userId);

    const existingUser = await usersCollection.findOne({ _id: userId });

    if (existingUser) {
      console.log('User found:', existingUser);
      res.status(200).send({ data: { user: existingUser } });
    } else {
      console.log('User not found with ID:', userId);
      res.status(400).send({ error: 'User does not exist' });
    }
  } catch (err) {
    console.error('Error:2', err.message);
    //res.status(500).send({ error: 'Internal Server Error' });
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
/*
app.get('/api/countries', async (req, res) => {
  const countries = await readDataFromFile("data/countries.json");
  res.status(200).send({data: {countries}});
});
*/

// GET countries

app.get('/api/countries', async (req, res) => {
  try {
      await client.connect();
      const database = client.db('ContactForm');
      const collection = database.collection('countries');

      const countries = await collection.find({}).toArray(); 
      if (countries.length > 0) {
          res.status(200).send({ data: { countries } });
      } else {
          res.status(404).send({ message: 'No countries found' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'An error occurred while retrieving countries' });
  } finally {
      await client.close();
  }
});



// POST add new message
app.post('/api/message/add', async (req, res) => {
  const { name, message, gender, country } = req.body;
  if (!name || !message || !gender || !country) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const db = client.db('ContactForm');
    const messagesCollection = db.collection('messages'); 

    const newMessage = {
      name,
      message,
      gender,
      country,
      creationDate: new Date(),
      read: false,
    };

    const result = await messagesCollection.insertOne(newMessage);

    res.status(200).send({ data: { messageId: result.insertedId, ...newMessage } });  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});



// GET messages
app.get('/api/messages', async (req, res) => {
  /*const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }*/
  try {
    const db = client.db('ContactForm');
    const messagesCollection = db.collection('messages');
    const messages = await messagesCollection.find().toArray(); 
    res.status(200).send({ data: { messages } });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// GET message by id
app.get('/api/message/:id', async (req, res) => {
  /*const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }
   ObjectId.createFromHexString  
  */
    try {
      const db = client.db('ContactForm');
      const messagesCollection = db.collection('messages');
      const messageId = req.params.id;
  
      // Gelen ID'yi kontrol et
      console.log('Received ID:', messageId);
  
      // ID geçerliliğini kontrol et
      if (!(ObjectId.createFromHexString).isValid(messageId)) {
        return res.status(400).send({ error: 'Invalid message ID format' });
      }

      // Mesajı bul
      const message = await messagesCollection.findOne({ _id: messageId});
      if (!message) {
        return res.status(404).send({ error: 'Message not found' });
      }
  
      res.status(200).send({ data: { message } });
    } catch (error) {
      console.error('Error fetching message:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  });
  
// POST read message by id
app.post('/api/message/read/:id', async (req, res) => {
 /* const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }
    
  */

  try {
    const db = client.db('ContactForm');
    const messagesCollection = db.collection('messages');
    const messageId = new ObjectId.createFromHexString(req.params.id); 

    const result = await messagesCollection.findOneAndUpdate(
      { _id: messageId },
      { $set: { read: true } },
      { returnOriginal: false } 
    );

    if (!result.value) {
      return res.status(404).send({ error: 'Message not found' });
    }

    res.status(200).send({ data: { message: result.value } });
  } catch (error) {
    console.error('Error reading message:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});



// POST delete message by id
app.post('/api/message/delete/:id', async (req, res) => {
  /*const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }
*/
  try {
    const db = client.db('ContactForm');
    const messagesCollection = db.collection('messages');
    const messageId = new ObjectId.createFromHexString(req.params.id); // ID'yi ObjectId formatına çevir

    const result = await messagesCollection.findOneAndDelete({ _id: messageId });

    if (!result.value) {
      return res.status(404).send({ error: 'Message not found' });
    }

    res.status(200).send({ data: { message: { id: result.value._id } } });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});



// POST add new user with reader role
app.post('/api/user/add-reader', async (req, res) => {
 /* const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }*/

  const { username, password, base64Photo } = req.body;
  if (!username || !password || !base64Photo) {
    return res.status(400).send({ error: 'Username, password, and photo are required' });
  }
  try {
    const db = client.db('ContactForm');
    const usersCollection = db.collection('users');

    // Check if the username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ error: 'Username already exists' });
    }

    // Create a new user
    const newUser = {
      username,
      password, 
      base64Photo,
      role: "reader"
    };

    // Insert the new user into the collection
    const result = await usersCollection.insertOne(newUser);

    const insertedUser = await usersCollection.findOne({ _id: result.insertedId });

    res.status(200).send({ data: { user: insertedUser } });
  } catch (error) {
    console.error('Error adding new user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});


// GET users
app.get('/api/users', async (req, res) => {
/*  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }*/
  try {
    const db = client.db('ContactForm');
    const usersCollection = db.collection('users');
    
    const users = await usersCollection.find().toArray(); // Tüm kullanıcıları dizi olarak al

    res.status(200).send({ data: { users } });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});


// GET user by id 
app.get('/api/user', async (req, res) => {
  const { username, password } = req.query;
//detay bilgiyi çekemiyorum bir türlü
  
  try {
    const db = client.db('ContactForm');
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username, password });
    
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});



// POST update user by id
app.post('/api/user/update', async (req, res) => {
  /* const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if (!authCheck) {
    return;
  }*/

  const { username, password, base64Photo, newUsername, newPassword } = req.body;

  if (!username || !password || !base64Photo) {
    return res.status(400).send({ error: 'Username, password, and photo are required' });
  }

  try {
    const db = client.db('ContactForm');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username, password });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const updatedUser = {
      username: newUsername || username,
      password: newPassword || password,
      base64Photo
    };

    const result = await usersCollection.findOneAndUpdate(
      { _id: user._id },
      { $set: updatedUser },
      { returnOriginal: false }
    );

    if (!result.value) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send({ data: { user: result.value } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});



// Post Filter messages
//new endpoint
app.post('/api/messages/filter', async (req, res) => {
  /*const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if (!authCheck) {
    return;
  }*/

  const { sortBy, filterOptions, messageLimit } = req.body;

  try {
    const db = client.db('ContactForm');
    const messagesCollection = db.collection('messages');

    let query = {};

    if (filterOptions.gender && filterOptions.gender.length > 0) {
      query.gender = { $in: filterOptions.gender };
    }

    if (filterOptions.status && filterOptions.status.length > 0) {
      query.read = filterOptions.status.includes('read') ? true : false;
    }

    let filteredMessages = messagesCollection.find(query);


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

    if (messageLimit) {
      filteredMessages = filteredMessages.limit(messageLimit);
    }

    const messages = await filteredMessages.toArray();

    res.status(200).send({ data: { messages } });
  } catch (error) {
    console.error('Error filtering messages:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});


// Helper function to check token and role
async function checkTokenAndRole(req, res, allowedRoles) {
  const token = req.headers.token;
  if (!token) {
    res.status(401).send({ error: 'Token is required' });
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    const db = client.db('ContactForm');
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new MongoClient.ObjectId(decoded.userId) });

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).send({ error: 'Access denied' });
      return false;
    }
    
    return true;
  } catch (error) {
    res.status(401).send({ error: 'Token is invalid' });
    return false;
  }
}

module.exports = {
  getDb: () => db,
};
module.exports = app;