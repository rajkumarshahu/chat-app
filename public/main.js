
$(function() {
     var socket = io();
     var currentUser = null;
     var messageboard = $('.chatroom_left');
     var roomboard = $('.chatroom_right');
     var messageboardroom = $('.chatroom_left_room');
     var roomList = [];


    socket.on('job', function(v) {});
 

    $('#btnSubmit').click(function() {
         const frmLogin = $('#frmLogin');
         var frmValues = frmLogin.serialize();
         socket.emit('register user', frmValues)
         currentUser = $('#exampleInputEmail1').val();
         $('.reguser').text(currentUser);
         $(frmLogin).hide();
         $('.chatroom').show();
     });
 
     $("#test").click(function() {
       var msg = $('.message').val();
       if (msg != '' || msg != null) {
         socket.emit('sendmessage', {'currentuser': currentUser, 'message': msg});
         clearmsg();
       }
    });
 
    $("ul li button").on('click', function() {
      const roomName = $(this).text();
      if (confirm('Do you want to Join ' + roomName)){
         socket.emit('joinroom', roomName);
      }
    });

    socket.on('joinroom', (username, roomname) => {
      if (currentUser === username) {
        messageboard.hide();
        messageboardroom.show();
        messageboardroom.append("<p>" + username + " : Join the new room : "  + roomname + " </p>")
      } 
      messageboard.append("<p>" + username + " : Join the new room : "  + roomname + " </p>")
    });
  
 
    socket.on('register user', (username, roomlist) => {
      if (username != null) {
        //let _htmlString = "";
        if (roomList.length <= 0) {
          roomList = roomlist;
          /*_htmlString = "<ul id='rul'>";
          for(let i = 0; i < roomList.length;i++)
          {
              _htmlString += "<li onclick='onClickRoom()'>" + roomList[i].roomName + "</li>"
             
          }
          _htmlString += "</ul>";
        */
        }
        messageboard.append("<p>" + username + " : Join the chatRoom. </p>")
      }
    });

    socket.on('sendmessage', (v) => {
     messageboard.append("<p>" + v.currentuser + " : " +  v.message + "</p>")
    });

    socket.on('sendmessagetoroom', (v) => {
      messageboardroom.append("<p>" + v.currentuser + " : " +  v.message + "</p>")
    })
    
   socket.on('disconnect', (v) => {
      /*if (v == $('#exampleInputEmail1').val()) {
        $('.chatroom').hide();
        $(frmLogin).show();
      } else {
      */
     if (v != null) {
      messageboard.append("<p>" + v + " : leave from chat. </p>")
     }
      //}
    });
    function clearmsg()
    {
      $('.message').val('');
    }
 
 
     function init()
     {
       $(".chatroom").hide();
       $('#frmLogin').show();
       messageboardroom.hide();
     }
 
     init();
 
   });