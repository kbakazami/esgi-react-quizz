import {Server} from "socket.io";

export const config = {
    api: {
        bodyParser: false,
    }
}

const ioHandler = (req, res) => {
    if(!res.socket.server.io) {
        console.log('Socket is initializing');

        const path = '/api/socket/io';
        const httpServer = res.socket.server;
        const io = new Server(httpServer, {
            path: path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
    }
    res.end();
}

export default ioHandler;