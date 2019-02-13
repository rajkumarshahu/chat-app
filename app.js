//var express = require('express');
var serve = require('koa-static');
var koa = require('koa');
var app = new koa();//express();
var path = require('path');
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);

const PORT = process.env.PORT || 5001;

var userList = [] ;


// Routing
//app.use(app.static(path.join(__dirname, 'public')));
app.use(serve(path.join(__dirname, 'public')));


//Socket listen by server

var numuser = 0 ;
//var messageList = [];

const roomList = []

io.on('connection', function(socket) {
    console.log('welcome...');
    socket.on('joinroom', (roomname) => {
        socket.join(roomname);
        socket.roomList.push({'roomname': roomname, 'username': socket.userName});
        socket.roomName = roomname;
        io.sockets.to(roomname).emit('joinroom', socket.userName, socket.roomName)
    });
    socket.on('register user', (v) => { //, (v, callback)
       const email = v.split('&')[0].split('=')[1];
       socket.userName = email;
       checkEmail(email, (r) => {
           if (!r) {
               const emailObject = {'email': email};
               userList.push(emailObject);
               socket.userName = email;
               socket.roomList = roomList;
               //socket.emit('join', userList);   // send jobs
               io.sockets.emit('register user', socket.userName, socket.roomList);
           }
           else {
               console.log('already done' +  email);
           }
       })
    });

    //Send message 
    socket.on('sendmessage', (v) => {
       console.log(socket.roomList)
       const room = socket.roomList.find(x => x.username === socket.userName);
       if (room === undefined) {
        io.sockets.emit('sendmessage', v);
       }
       else {
            io.sockets.to(room.roomname).emit('sendmessagetoroom', v);
       }
    });

    // disconnect 
    socket.on('disconnect', () => {
        //socket.disconnect(true);
        io.sockets.emit('disconnect', socket.userName);
    });
});


/* General function */
const checkEmail = function(email, callback)
{
    if (userList.length > 0)
    {
        const user = userList.find(x => x.email === email);
        if ( user === undefined) {
            callback(false);
        }
        else {
            callback(true);
        }
    }
    else callback(false);
}

server.listen(PORT, () => {
  console.log('Server is running on PORT %d', PORT);
});
