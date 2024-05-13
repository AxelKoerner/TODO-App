import {MongoClient} from "mongodb";
import {config} from "dotenv";
config()

export async function connectToCluster(uri) {
    let mongoClient;
    try {
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
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
        return await collection.find(title, {sort: {title: -1}}).toArray();
    }
    finally {
        await mongoClient.close();
    }
}

export async function editTodoDocument(title, description) {
    const uri = process.env.DB_URI
    let mongoClient;
    const filter = {title: title}
    const updateDoc = {
        $set: {description: description}
    }
    try {
        mongoClient = await connectToCluster(uri)
        const db = mongoClient.db('todoappdb');
        const collection = db.collection('todoappcollection');
        return await collection.updateOne(filter, updateDoc);
    } finally {
        await mongoClient.close();
    }
}

export async function findOneTodoDocument(title){
    const uri = process.env.DB_URI
    let mongoClient;
    try {
        mongoClient = await connectToCluster(uri)
        const db = mongoClient.db('todoappdb');
        const collection = db.collection('todoappcollection');
        return await collection.findOne(title)
    }
    finally {
        await mongoClient.close();
    }
}

export async function deleteTodoDocument(title) {
    const uri = process.env.DB_URI;
    let mongoClient;
    try {
        mongoClient = await connectToCluster(uri);
        const db = mongoClient.db('todoappdb');
        const collection = db.collection('todoappcollection');
        return await collection.deleteMany(title)
    }
    finally {
        await mongoClient.close();
    }
}

