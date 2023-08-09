import { Server } from 'socket.io';
import db from "./database.js";

const io = new Server(null, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cors: {
        origin: 'https://itransition-task4-react.vercel.app',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
});

export const initSocketServer = (server) => {
    io.attach(server)

    io.on('connection', (socket) => {
        console.log('client connected: ', socket.id);

        socket.on('join', async (email) => {
            try{
                await db.setOnline(email)
                io.emit('userJoined', email);
            } catch (err){
                console.error('Error updating user status:', err);
            }
        });

        socket.on('userDisconnect', async (email) => {
            if (email) {
                try{
                    await db.setOffline(email)
                    io.emit('userLeft', email);
                }catch (err){
                    console.error('Error updating user status:', err);

                }
            }
        });
    });
};

export { io }