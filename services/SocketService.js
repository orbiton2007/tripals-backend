const socketIO = require('socket.io');
const ChatService = require('../api/chat/ChatService')

var io;
var rooms = []

function setup(http) {
    io = socketIO(http);
    io.on('connection', function (socket) {
        // console.log('a user connected');

        socket.on('disconnect', () => {
            // console.log('user disconnected');

        });
        socket.on('chatJoin', async ({ chat, user }) => {
            if (user && chat) {
                socket.join(chat._id)
            }
        });
        socket.on('chat msg', async ({ chat, user, msg }) => {
            if (user && chat) {
                // console.log('message: ' + msg);
                chat.msgs.push({ from: user.firstName, txt: msg, createdAt: Date.now() })
                await ChatService.update(chat)
                io.to(chat._id).emit('chat newMsg', { from: user.firstName, txt: msg, createdAt: Date.now() });
            }
        });
        socket.on('user typing', ({ chat, user}) => {
                // io.to(chat._id).emit('chat typing', { from: user.firstName, txt: msg });
                socket.broadcast.to(chat._id).emit('chat typing', { from: user.firstName, txt: 'is typing', createdAt: Date.now() });
        });
        socket.on('stop typing', ({ chat, user}) => {
                // io.to(chat._id).emit('chat typing', { from: user.firstName, txt: msg });
                socket.broadcast.to(chat._id).emit('chat typing', '');
        });
        socket.on('create room', (user) => {
            if(user.loggedInUser){
                console.log('new room =>', user.loggedInUser._id);
                var room = user.loggedInUser._id;
                rooms.push(room)
                socket.join(room)
            }
        });
        socket.on('join trip', ({ user, owner }) => {
            var room = rooms.find(room => room === owner._id)
            io.to(room).emit('welcome', { txt: 'heyy' })
        });
    });
}


module.exports = {
    setup
}