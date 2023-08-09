import express from 'express';
import http from 'http';
import { initSocketServer } from './socket.js';
import cors from 'cors';
import { regValidation, updateValidation } from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import {
    registration,
    authorization,
    getMe,
    getAll,
    updateData,
    deleteUser,
    changeStatus
} from './controllers/userController.js'

const app = express();
const server = http.createServer(app);
initSocketServer(server);

app.use(cors({
    origin: 'https://itransition-task4-react.vercel.app',
}));
app.use(express.json());
    
const port = process.env.PORT || 3301

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});

app.post('/auth/login', authorization);
app.post('/auth/registry', regValidation, registration);
app.get('/auth/me', checkAuth, getMe);
app.get('/users', checkAuth, getAll);
app.put('/auth/update', checkAuth, updateValidation, updateData);
app.delete('/users/delete', checkAuth, deleteUser)
app.put('/users/change', checkAuth, changeStatus)
