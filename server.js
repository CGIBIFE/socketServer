const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/quizda/index.html');
})
app.use(express.static(__dirname + '/dist/quizda/'));

io.on('connection',(socket) => {
    socket.on('create', (room) => {
        socket.join(room)
    });

    socket.on('join',(details) => {
        socket.join(details.channel)
        socket.to(details.channel).emit('userJoined',details.name)
        //io.emit('userJoined',details.name)
    })

    socket.on('adminLeft',(roomInfo) => {
        socket.to(roomInfo.channel).emit('adminLeft')
    })

    socket.on('userLeft',(userInfo) => {
        socket.to(userInfo.channel).emit('userLeft',userInfo)
    })

    socket.on('sendQuestion',(question) => {
       socket.to(question.channel).emit('receiveQuestion', {question:question.question, answers:question.answer,id:question.id});
    })
    socket.on('submitAnswer',(answer) => {
       socket.to(answer.channel).emit('checkAnswer', answer);
    })
    socket.on('endChannel',(room) => {
        console.log(room.users)
        socket.to(room.channel).emit('channelEnded', {users:room.users})
    })


})

http.listen(3000, function () {
    console.log('Localhost:3000')
})
