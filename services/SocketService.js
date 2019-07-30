const socketIO = require('socket.io');
const ChatService = require('../api/chat/ChatService')
const UserService = require('../api/user/UserService')
const NotificationsService = require('../api/notification/NotificationsService')

var io;

function setup(http) {
    io = socketIO(http);
    io.on('connection', function (socket) {
        // console.log('a user connected');

        socket.on('disconnect', () => {
            // console.log('user disconnected');

        });
        socket.on('trip details', async (tripId) => {
            socket.join(tripId)
        });
        socket.on('disconnect trip', async (tripId) => {
            socket.leave(tripId)
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
            if (user) socket.join(user.notifications.roomId)
        });
        socket.on('join trip', async ({ user, trip, room }) => {
            var msg = `Request from ${user.firstName} ${user.lastName} about the trip to ${trip.destination}`;
            room.requests.unshift(msg)
            await NotificationsService.update(room)
            io.to(room._id).emit('new request', msg, trip, user)
            socket.broadcast.to(trip._id).emit('update trip', trip)
        });
        socket.on('leave trip', (trip) => {
            socket.broadcast.to(trip._id).emit('update trip', trip)
        })
        socket.on('like trip', (trip) => {
            socket.broadcast.to(trip._id).emit('update trip', trip)
        })
        socket.on('approve user', (trip) => {
            socket.broadcast.to(trip._id).emit('update trip', trip)
        })
        socket.on('reject user', (trip) => {
            socket.broadcast.to(trip._id).emit('update trip', trip)
        })
    });
}


module.exports = {
    setup
}