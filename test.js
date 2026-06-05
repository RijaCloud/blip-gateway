const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb+srv://arizorajoelina431_db_user:XjHYBUFYjZyLrPo8@cluster0.hrckukk.mongodb.net/?appName=Cluster0');
await client.connect();
console.log('Connecté');