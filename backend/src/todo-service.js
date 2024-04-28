import {MongoClient} from "mongodb";
import {config} from "dotenv";
config()

export async function connectToCluster(uri) {
    let mongoClient;
    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');

        return mongoClient;
    }
    catch(error) {
        console.error('Connection to MongoDB Atlas cluster failed!', error);
        process.exit();
    }
}

export async function createTodoDocument(title, description){
    const uri = process.env.DB_URI
    let mongoClient
    try {
        mongoClient = await connectToCluster(uri);
        const db = mongoClient.db('todoappdb');
        const collection = db.collection('todoappcollection');
        const todoDocument = {
            title: title,
            description: description
        };
        await collection.insertOne(todoDocument);
    }
    finally {
        await mongoClient.close();
    }
}

export async function findTodoDocument(title){
    const uri = process.env.DB_URI
    let mongoClient;
    try {
        mongoClient = await connectToCluster(uri)
        const db = mongoClient.db('todoappdb');
        const collection = db.collection('todoappcollection');
        return await collection.find(title).toArray();
    }
    finally {
        await mongoClient.close();
    }
}

export async function updateTodoDocument(collection, title, updatedFields) {
    await collection.updateMany(
        {title},
        {$set: updatedFields}
    )
}

export async function deleteTodoDocument(collection, title) {
    await collection.deleteMany({title})
}

