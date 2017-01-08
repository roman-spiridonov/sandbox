var log = require('../libs').logger(module);
var Server = require('socket.io');

module.exports = function (server) {
    var io = new Server(server, {
        origins: 'localhost:3000',

    });  // to not baffle WebStorm's auto-complete

    io.on('connection', function (socket) {  // socket is for concrete client
        log.info('User %s is connected.');
        socket.on('message_client', function (data, cb) {
            log.info("Data received via socket.io [User: message]. unknown : %s.", data.message);
            socket.broadcast.emit('message_server', data); // data = { message: "chat message" }
            cb(data);  // current user should also receive a message
        });
    });
};
