const socketIO = require('socket.io');
const ChatService = require('../api/chat/ChatService')
const UserService = require('../api/user/UserService')

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
                chat.msgs.push({ from: user.firstName, txt: msg, createdAt: Date.now() })
                await ChatService.update(chat)
                io.to(chat._id).emit('chat newMsg', { from: user.firstName, txt: msg, createdAt: Date.now() });
            }
        });
        socket.on('user typing', ({ chat, user }) => {
            socket.broadcast.to(chat._id).emit('chat typing', { from: user.firstName, txt: 'is typing', createdAt: Date.now() });
        });
        socket.on('stop typing', ({ chat, user }) => {
            socket.broadcast.to(chat._id).emit('chat typing', '');
        });
        socket.on('create room', (user) => {
            if (user.loggedInUser) {
                // var room = user.loggedInUser._id;
                // rooms.push(room)
                socket.join(user.loggedInUser._id)
            }
        });
        socket.on('join trip', async ({ user, trip, owner }) => {
            // var room = rooms.find(room => room === owner._id)
            var msg = `${user.firstName} ${user.lastName} send you request to join the trip ${trip.destination}`;
            // owner.notifications.push(msg)
            // await UserService.update(owner)
            io.to(owner._id).emit('new request', msg)
        });
    });
}


module.exports = {
    setup
}