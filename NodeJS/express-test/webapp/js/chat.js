$(function () {
    var socket = io.connect();  // no params: current server

    $('.chat__form').submit(function () {
        var $messageEl = $('#chat__message'),
            message = $messageEl.val();
        console.log("Typed the message: ", message);
        if(!message) {
            $messageEl.addClass('chat__message_invalid');
        } else {
            $messageEl.removeClass('chat__message_invalid');
        }

        socket.emit('message_client', {message: message}, function(data) {  // get this user's message from server in callback
            addMessage(data.message);
        });
        $messageEl.val("");
        return false;  // prevent form submission
    });

    socket.on('message_server', function (data) {  // data = { message: "chat message" }
        addMessage(data.message);
    });



    function addMessage(message) {
        var $messagesEl = $('.chat__messages').find('ul');  // <=> $('.chat__messageList', 'ul')
        $('<li>').text(message).addClass('list-group-item').appendTo($messagesEl);
    }

});