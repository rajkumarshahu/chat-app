
$(function() {
     var socket = io();
     var currentUser = null;
     var messageboard = $('.chatroom_left');


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
 
    socket.on('register user', (v) => {
      if (v != null) {
        messageboard.append("<p>" + v + " : Join the chatRoom. </p>")
      }
    });
    socket.on('sendmessage', (v) => {
     messageboard.append("<p>" + v.currentuser + " : " +  v.message + "</p>")
    });

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
     }
 
     init();
 
   });