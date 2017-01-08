$(function () {
    var socket = io.connect({
        reconnectionAttempts: 10
    });  // no params: current server
    var $formEl = $('.chat__form');
    var $messageEl = $('#chat__message');
    var $statusEl = $('.chat__status');
    var isDisabled = false;

    $formEl.submit(function () {
        var message = $messageEl.val();
        if(!isValid()) {
            $messageEl.addClass('chat__message_invalid');
        } else {
            $messageEl.removeClass('chat__message_invalid');
        }

        socket.emit('message_client', {message: message}, function(data) {  // get this user's message from server in callback
            console.log("Sent the message: ", data.message);
            addMessage(data.message);
        });
        $messageEl.val("");
        return false;  // prevent form submission
    });

    socket.on('message_server', function (data) {  // data = { message: "chat message" }
        addMessage(data.message);
    }).on('connect', function () {
        showStatus('Connection established.', 'text-success');
    }).on('disconnect', function () {
        showStatus('Disconnected.', 'text-warning');
    }).on('reconnect', function () {
        showStatus('Connection re-established.', 'text-success');
    }).on('reconnect_attempt', function () {
        showStatus('Attempting to reconnect.', 'text-info');
    }).on('reconnect_failed', function () {
        showStatus('Failed to reconnect.', 'text-warning');
    });


    function isValid() {
        var message = $messageEl.val();
        if(!message) return false;
        return true;
    }

    function addMessage(message) {
        var $messagesEl = $('.chat__messages').find('ul');  // <=> $('.chat__messageList', 'ul')
        $('<li>').text(message).addClass('list-group-item').appendTo($messagesEl);
    }

    function showStatus(status, classStr) {
        $statusEl.removeClass();
        $statusEl.addClass(classStr).text(status);
        if(classStr !== 'text-success') {
            $messageEl.prop('disabled', true);
            $(':submit', $formEl).prop('disabled', true);
            isDisabled = true;
        } else if(isDisabled) {
            $messageEl.prop('disabled', "");
            $(':submit', $formEl).prop('disabled', "");
            isDisabled = false;
        }
    }

});