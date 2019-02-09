var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const PORT = process.env.PORT || 5001;

//
var userList = [] ;


// Routing

app.use(express.static(path.join(__dirname, 'public')));


//Socket listen by server

var numuser = 0 ;
//var messageList = [];

io.on('connection', function(socket) {
    console.log('welcome...');
    socket.on('register user', (v) => { //, (v, callback)
       const email = v.split('&')[0].split('=')[1];
       checkEmail(email, (r) => {
           if (!r) {
               const emailObject = {'email': email};
               userList.push(emailObject);
               socket.userName = email;
               socket.emit('job', userList);   // send jobs
           }
           else {
               console.log('already done' +  email);
           }
       })
    });

    //Send message 
    socket.on('sendmessage', (v) => {
        console.log(v);
        //messageList.push(v);
        // we tell the client to execute 'new message'
       io.sockets.emit('sendmessage', v);
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
