import express from 'express';
import {createTodoDocument, findTodoDocument} from "./todo-service.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/todo', async (req, res) => {
    const {title, description} = req.body;
    try {
        await createTodoDocument(title, description);
        res.status(201).json({message: `Todo created with title ${title}`});
    } catch (error) {
        console.error('Error creating todo document', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/api/todo', async (req, res) => {
    const {title} = req.query;
    try {
        const todo = await findTodoDocument();
        res.status(200).json({message: `Searched for todo's with title: ${title}`, todo});
    } catch (error) {
        console.error('Error fetching todo document', error);
        res.status(500).json({error: 'Internal server error'});
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})
